"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientKilledError = void 0;

var _workerClientRejectedError = require("./worker-client-rejected-error.cjs");

class WorkerClientKilledError extends _workerClientRejectedError.WorkerClientRejectedError {
  constructor(signal) {
    super(`The server was killed by signal ${signal}.`);
  }

}

exports.WorkerClientKilledError = WorkerClientKilledError;

//# sourceMappingURL=worker-client-killed-error.cjs.map