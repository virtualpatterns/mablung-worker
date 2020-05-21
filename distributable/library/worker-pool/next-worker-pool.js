import Is from '@pwn/is';

import { WorkerPool } from '../worker-pool.js';

class NextWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);

    this._nextIndex = 0;

  }

  _selectProcessInformation() {

    let processInformation = null;

    while (Is.null(processInformation) || !processInformation.process.isConnected) {
      processInformation = this._getProcessInformation(this._nextIndex++ % this.numberOfProcess);
    }

    return processInformation;

  }}



export { NextWorkerPool };
//# sourceMappingURL=next-worker-pool.js.map