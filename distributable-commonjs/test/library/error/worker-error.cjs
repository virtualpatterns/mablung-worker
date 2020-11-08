"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerError = void 0;

class WorkerError extends Error {
  constructor(...parameter) {
    super(...parameter);
  }

}

exports.WorkerError = WorkerError;
//# sourceMappingURL=worker-error.cjs.map