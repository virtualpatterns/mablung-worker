import Is from '@pwn/is';

import { WorkerPool } from '../worker-pool.js';

class RandomWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);
  }

  async _selectProcessInformation() {

    let processInformation = null;

    while (Is.null(processInformation) || !processInformation.process.isConnected) {
      processInformation = this._getProcessInformation(Math.round(Math.random() * (this.numberOfProcess - 1)));
    }

    return processInformation;

  }}



export { RandomWorkerPool };
//# sourceMappingURL=random-worker-pool.js.map