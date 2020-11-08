"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RandomWorkerPool = void 0;

var _mablungIs = require("@virtualpatterns/mablung-is");

var _workerPool = require("../worker-pool.cjs");

class RandomWorkerPool extends _workerPool.WorkerPool {
  constructor(...parameter) {
    super(...parameter);
  }

  async _selectProcess() {
    let process = null;

    while (_mablungIs.Is.null(process) || !process.isConnected) {
      process = this._getProcess(Math.round(Math.random() * (this.numberOfProcess - 1)));
    }

    return process;
  }

}

exports.RandomWorkerPool = RandomWorkerPool;
//# sourceMappingURL=random-worker-pool.cjs.map