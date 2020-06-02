import { WorkerClientRejectedError } from './worker-client-rejected-error.js';

class WorkerClientInternalError extends WorkerClientRejectedError {

  constructor(internalError) {
    super(`The server exited with the internal error message '${internalError.message}'.`);
    this._internalError = internalError;
  }

  get internalError() {
    return this._internalError;
  }}



export { WorkerClientInternalError };
//# sourceMappingURL=worker-client-internal-error.js.map