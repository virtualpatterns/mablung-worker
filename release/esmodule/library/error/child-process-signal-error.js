import { ChildProcessError } from './child-process-error.js';

class ChildProcessSignalError extends ChildProcessError {

  constructor(signal, pid) {
    super(`Unable to send the signal '${signal}' to the pid ${pid}.`);
  }}



export { ChildProcessSignalError };

//# sourceMappingURL=child-process-signal-error.js.map