"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientInternalError = void 0;

var _workerClientRejectedError = require("./worker-client-rejected-error.cjs");

class WorkerClientInternalError extends _workerClientRejectedError.WorkerClientRejectedError {
  constructor(internalError) {
    super(`The server exited with the internal error message '${internalError.message}'.`);
    this._internalError = internalError;
  }

  get internalError() {
    return this._internalError;
  }

}

exports.WorkerClientInternalError = WorkerClientInternalError;
//# sourceMappingURL=worker-client-internal-error.cjs.map