import { Is } from '@virtualpatterns/mablung-is';

import { WorkerPool } from '../worker-pool.js';

class RandomWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);
  }

  async _selectProcess() {

    let process = null;

    while (Is.null(process) || !process.isConnected) {
      process = this._getProcess(Math.round(Math.random() * (this.numberOfProcess - 1)));
    }

    return process;

  }}



export { RandomWorkerPool };
//# sourceMappingURL=random-worker-pool.js.map