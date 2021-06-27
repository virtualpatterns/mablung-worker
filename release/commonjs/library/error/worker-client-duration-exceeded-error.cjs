"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientDurationExceededError = void 0;

var _workerClientError = require("./worker-client-error.cjs");

class WorkerClientDurationExceededError extends _workerClientError.WorkerClientError {
  constructor(maximumDuration) {
    super(`The operation duration exceeded the maximum duration of ${maximumDuration}ms.`);
  }

}

exports.WorkerClientDurationExceededError = WorkerClientDurationExceededError;

//# sourceMappingURL=worker-client-duration-exceeded-error.cjs.map