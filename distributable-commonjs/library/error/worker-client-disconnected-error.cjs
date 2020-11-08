"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientDisconnectedError = void 0;

var _workerClientRejectedError = require("./worker-client-rejected-error.cjs");

class WorkerClientDisconnectedError extends _workerClientRejectedError.WorkerClientRejectedError {
  constructor() {
    super('The server disconnected.');
  }

}

exports.WorkerClientDisconnectedError = WorkerClientDisconnectedError;
//# sourceMappingURL=worker-client-disconnected-error.cjs.map