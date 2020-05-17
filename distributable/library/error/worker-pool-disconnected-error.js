import { WorkerPoolError } from './worker-pool-error.js';

class WorkerPoolDisconnectedError extends WorkerPoolError {

  constructor() {
    super('The servers disconnected from all processes.');
  }}



export { WorkerPoolDisconnectedError };
//# sourceMappingURL=worker-pool-disconnected-error.js.map