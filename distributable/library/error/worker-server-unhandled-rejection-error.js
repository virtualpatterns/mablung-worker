import { WorkerServerError } from './worker-server-error.js';

class WorkerServerUnhandledRejectionError extends WorkerServerError {

  constructor() {
    super(WorkerServerUnhandledRejectionError.name);
  }}



export { WorkerServerUnhandledRejectionError };
//# sourceMappingURL=worker-server-unhandled-rejection-error.js.map