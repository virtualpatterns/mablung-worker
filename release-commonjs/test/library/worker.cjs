"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPid = getPid;
exports.throwException = throwException;
exports.throwUncaughtException = throwUncaughtException;
exports.rejectUnhandledException = rejectUnhandledException;

var _workerExceptionError = require("./error/worker-exception-error.cjs");

var _workerUncaughtExceptionError = require("./error/worker-uncaught-exception-error.cjs");

var _workerUnhandledRejectionError = require("./error/worker-unhandled-rejection-error.cjs");

const Process = process;

function getPid(duration = 0) {
  if (duration > 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        /* c8 ignore next 1 */
        resolve(Process.pid);
      }, duration);
    });
  } else {
    return Process.pid;
  }
}

function throwException(duration = 0) {
  if (duration > 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        /* c8 ignore next 1 */
        reject(new _workerExceptionError.WorkerExceptionError());
      }, duration);
    });
  } else {
    throw new _workerExceptionError.WorkerExceptionError();
  }
}

function throwUncaughtException() {
  setImmediate(() => {
    throw new _workerUncaughtExceptionError.WorkerUncaughtExceptionError();
  });
}

function rejectUnhandledException() {
  setImmediate(() => Promise.reject(new _workerUnhandledRejectionError.WorkerUnhandledRejectionError()));
}
//# sourceMappingURL=worker.cjs.map