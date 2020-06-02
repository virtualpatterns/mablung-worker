import { WorkerClientError } from './worker-client-error.js';

class WorkerClientDurationExceededError extends WorkerClientError {

  constructor(maximumDuration) {
    super(`The operation duration exceeded the maximum duration of ${maximumDuration}ms.`);
  }}



export { WorkerClientDurationExceededError };
//# sourceMappingURL=worker-client-duration-exceeded-error.js.map