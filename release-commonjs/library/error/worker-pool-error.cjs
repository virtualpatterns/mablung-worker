"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerPoolError = void 0;

var _childProcessPoolError = require("./child-process-pool-error.cjs");

class WorkerPoolError extends _childProcessPoolError.ChildProcessPoolError {
  constructor(...parameter) {
    super(...parameter);
  }

}

exports.WorkerPoolError = WorkerPoolError;
//# sourceMappingURL=worker-pool-error.cjs.map