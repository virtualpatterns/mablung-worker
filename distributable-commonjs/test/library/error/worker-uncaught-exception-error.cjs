"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerUncaughtExceptionError = void 0;

var _workerError = require("./worker-error.cjs");

class WorkerUncaughtExceptionError extends _workerError.WorkerError {
  constructor() {
    super(WorkerUncaughtExceptionError.name);
  }

}

exports.WorkerUncaughtExceptionError = WorkerUncaughtExceptionError;
//# sourceMappingURL=worker-uncaught-exception-error.cjs.map