import { core } from './lfsCommands';
import {
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';

const pointer = (repo, filePath, pointerPath) => {
  let args = '';
  if (filePath) { args += `--file=${filePath} `; }
  if (pointerPath) { args += `--file=${pointerPath} `; }

  //eslint-disable-next-line
  let response = generateResponse();
  const repoPath = repo.workdir();

  return core.pointer(args, { cwd: repoPath })
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      response.buffer = Buffer.from(stdout);
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
};

export default pointer;
