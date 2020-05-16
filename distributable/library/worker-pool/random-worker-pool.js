import { WorkerPool } from '../worker-pool.js';

class RandomWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);
  }

  async selectProcess() {
    return this.getProcess(Math.round(Math.random() * (this.numberOfProcess - 1)));
  }}



export { RandomWorkerPool };
//# sourceMappingURL=random-worker-pool.js.map