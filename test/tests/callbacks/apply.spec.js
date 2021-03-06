import path from 'path';
import NodeGit from 'nodegit';
import { default as LFS } from '../../../build/src';
import { exec } from '../../../build/src/utils/execHelpers';
import track from '../../../build/src/commands/track';

function commitFile(repo, fileName, commitMessage) {
  let index;
  let treeOid;
  let parent;

  return repo.refreshIndex()
    .then((indexResult) => {
      index = indexResult;
    })
    .then(() => index.addByPath(fileName))
    .then(() => index.write())
    .then(() => index.writeTree())
    .then((oidResult) => {
      treeOid = oidResult;
      return NodeGit.Reference.nameToId(repo, 'HEAD');
    })
    .then(head => repo.getCommit(head))
    .then((parentResult) => {
      parent = parentResult;
      return NodeGit.Signature.default(repo);
    })
    .then(signatures =>
      repo.createCommit(
        'HEAD',
        signatures,
        signatures,
        commitMessage,
        treeOid,
        [parent]));
}
//eslint-disable-next-line
describe('Apply', function() {
  //eslint-disable-next-line
  it.only('Clean', function(){
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);
    let repository;

    return NodeGitLFS.Repository.open(workdirPath)
      .then((repo) => {
        repository = repo;
        return track(repo, ['*.md']);
      })
      .then(() => NodeGitLFS.LFS.register())
      .then(() => exec('base64 /dev/urandom | head -c 20 > big_file_test.md', { cwd: workdirPath }))
      .then(() => commitFile(repository, 'big_file_test.md', 'LFS Clean Test'))
      .catch(err => console.log(err));
  });
});
