import Is from '@pwn/is';

import { WorkerPool } from '../worker-pool.js';

class NextWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);

    this._nextProcess = 0;

  }

  selectProcess() {

    let process = null;

    while (Is.null(process) || !process.process.isConnected) {
      process = this._getProcessInformation(this._nextProcess++ % this.numberOfProcess);
    }

    return process;

  }}



export { NextWorkerPool };
//# sourceMappingURL=next-worker-pool.js.map