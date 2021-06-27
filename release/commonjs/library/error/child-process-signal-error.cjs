"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChildProcessSignalError = void 0;

var _childProcessError = require("./child-process-error.cjs");

class ChildProcessSignalError extends _childProcessError.ChildProcessError {
  constructor(signal, pid) {
    super(`Unable to send the signal '${signal}' to the pid ${pid}.`);
  }

}

exports.ChildProcessSignalError = ChildProcessSignalError;

//# sourceMappingURL=child-process-signal-error.cjs.map