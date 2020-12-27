"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientRejectedError = void 0;

var _workerClientError = require("./worker-client-error.cjs");

class WorkerClientRejectedError extends _workerClientError.WorkerClientError {
  constructor(...parameter) {
    super(...parameter);
  }

}

exports.WorkerClientRejectedError = WorkerClientRejectedError;
//# sourceMappingURL=worker-client-rejected-error.cjs.map