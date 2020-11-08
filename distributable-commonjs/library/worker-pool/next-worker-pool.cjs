"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NextWorkerPool = void 0;

var _mablungIs = require("@virtualpatterns/mablung-is");

var _workerPool = require("../worker-pool.cjs");

class NextWorkerPool extends _workerPool.WorkerPool {
  constructor(...parameter) {
    super(...parameter);
    this._nextIndex = 0;
  }

  _selectProcess() {
    let process = null;

    while (_mablungIs.Is.null(process) || !process.isConnected) {
      process = this._getProcess(this._nextIndex++ % this.numberOfProcess);
    }

    return process;
  }

}

exports.NextWorkerPool = NextWorkerPool;
//# sourceMappingURL=next-worker-pool.cjs.map