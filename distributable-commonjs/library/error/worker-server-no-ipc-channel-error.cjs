"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerServerNoIPCChannelError = void 0;

var _workerServerError = require("./worker-server-error.cjs");

class WorkerServerNoIPCChannelError extends _workerServerError.WorkerServerError {
  constructor() {
    super('The server has no IPC channel.');
  }

}

exports.WorkerServerNoIPCChannelError = WorkerServerNoIPCChannelError;
//# sourceMappingURL=worker-server-no-ipc-channel-error.cjs.map