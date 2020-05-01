import { WorkerClientRejectedError } from './worker-client-rejected-error.js';

class WorkerClientTerminatedError extends WorkerClientRejectedError {

  constructor(signal) {
    super(`The server was terminated by signal ${signal}.`);
  }}



export { WorkerClientTerminatedError };
//# sourceMappingURL=worker-client-terminated-error.js.map