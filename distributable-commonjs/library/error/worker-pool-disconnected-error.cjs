"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerPoolDisconnectedError = void 0;

var _workerPoolError = require("./worker-pool-error.cjs");

class WorkerPoolDisconnectedError extends _workerPoolError.WorkerPoolError {
  constructor() {
    super('The servers disconnected from all processes.');
  }

}

exports.WorkerPoolDisconnectedError = WorkerPoolDisconnectedError;
//# sourceMappingURL=worker-pool-disconnected-error.cjs.map