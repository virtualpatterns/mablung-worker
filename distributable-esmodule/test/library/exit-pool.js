import { Configuration } from '@virtualpatterns/mablung-configuration';
import { ExitClient } from './exit-client.js';
// import { LoggedPool } from './logged-pool.js'
import { WorkerPool } from '../../index.js';

const Process = process;

class ExitPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);
  }

  _createProcess(index, path, parameter, option) {
    return new ExitClient(path, parameter, Configuration.merge(option, { 'env': Configuration.merge(Process.env, { 'EXIT_POOL_INDEX': index }) }));
  }}



export { ExitPool };
//# sourceMappingURL=exit-pool.js.map