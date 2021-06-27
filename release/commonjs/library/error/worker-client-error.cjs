"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientError = void 0;

var _childProcessError = require("./child-process-error.cjs");

class WorkerClientError extends _childProcessError.ChildProcessError {
  constructor(...parameter) {
    super(...parameter);
  }

}

exports.WorkerClientError = WorkerClientError;

//# sourceMappingURL=worker-client-error.cjs.map