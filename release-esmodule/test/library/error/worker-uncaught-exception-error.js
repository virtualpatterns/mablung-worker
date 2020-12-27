import { WorkerError } from './worker-error.js';

class WorkerUncaughtExceptionError extends WorkerError {

  constructor() {
    super(WorkerUncaughtExceptionError.name);
  }}



export { WorkerUncaughtExceptionError };
//# sourceMappingURL=worker-uncaught-exception-error.js.map