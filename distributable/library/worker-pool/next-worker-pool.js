import Is from '@pwn/is';

import { WorkerPool } from '../worker-pool.js';

class NextWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);

    this._nextIndex = 0;

  }

  _selectProcess() {

    let process = null;

    while (Is.null(process) || !process.isConnected) {
      process = this._getProcess(this._nextIndex++ % this.numberOfProcess);
    }

    return process;

  }}



export { NextWorkerPool };
//# sourceMappingURL=next-worker-pool.js.map