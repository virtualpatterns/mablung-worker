"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerExceptionError = void 0;

var _workerError = require("./worker-error.cjs");

class WorkerExceptionError extends _workerError.WorkerError {
  constructor() {
    super(WorkerExceptionError.name);
  }

}

exports.WorkerExceptionError = WorkerExceptionError;

//# sourceMappingURL=worker-exception-error.cjs.map