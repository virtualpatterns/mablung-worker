"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerUnhandledRejectionError = void 0;

var _workerError = require("./worker-error.cjs");

class WorkerUnhandledRejectionError extends _workerError.WorkerError {
  constructor() {
    super(WorkerUnhandledRejectionError.name);
  }

}

exports.WorkerUnhandledRejectionError = WorkerUnhandledRejectionError;

//# sourceMappingURL=worker-unhandled-rejection-error.cjs.map