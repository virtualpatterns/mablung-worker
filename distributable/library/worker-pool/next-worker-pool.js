import { WorkerPool } from '../worker-pool.js';

class NextWorkerPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);

    this._nextProcess = 0;

  }

  selectProcess() {
    return this.getProcess(this._nextProcess++ % this.numberOfProcess);
  }}



export { NextWorkerPool };
//# sourceMappingURL=next-worker-pool.js.map