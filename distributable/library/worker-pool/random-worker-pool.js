import Is from '@pwn/is';

import { WorkerPool } from '../worker-pool.js';

class RandomWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);
  }

  async selectProcess() {

    let process = null;

    while (Is.null(process) || !process.process.isConnected) {
      process = this.getProcess(Math.round(Math.random() * (this.numberOfProcess - 1)));
    }

    return process;

  }}



export { RandomWorkerPool };
//# sourceMappingURL=random-worker-pool.js.map