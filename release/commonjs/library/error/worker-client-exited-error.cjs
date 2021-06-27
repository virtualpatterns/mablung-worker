"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientExitedError = void 0;

var _workerClientRejectedError = require("./worker-client-rejected-error.cjs");

class WorkerClientExitedError extends _workerClientRejectedError.WorkerClientRejectedError {
  constructor(code) {
    super(`The server exited with code ${code}.`);
  }

}

exports.WorkerClientExitedError = WorkerClientExitedError;

//# sourceMappingURL=worker-client-exited-error.cjs.map