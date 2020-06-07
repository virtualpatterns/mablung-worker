import { Configuration } from '@virtualpatterns/mablung-configuration';
import { Is } from '@virtualpatterns/mablung-is';

import { ChildProcessPool } from './child-process-pool.js';
import { WorkerClient } from './worker-client.js';
import { WorkerPoolModuleHandler } from './worker-pool-module-handler.js';
import { WorkerPoolParameter } from './worker-pool-parameter.js';

import { WorkerPoolDisconnectedError } from './error/worker-pool-disconnected-error.js';

const Process = process;

class WorkerPool extends ChildProcessPool {

  constructor(...parameter) {
    super(...WorkerPoolParameter.getConstructorParameter(...parameter));

    this._module = new Proxy(this, WorkerPoolModuleHandler);

  }

  _createProcess(index, path, parameter, option) {
    return new WorkerClient(path, parameter, Configuration.merge(option, { 'env': Configuration.merge(Process.env, { 'WORKER_POOL_INDEX': index }) }));
  }

  async _selectProcess() /* methodName, parameter */{
    let { index } = await this.ping();
    return this._getProcess(index);
  }

  get maximumDuration() {
    return this.option.maximumDuration;
  }

  set maximumDuration(value) {
    this.option.maximumDuration = value;
    this._getConnectedProcess().forEach(workerClient => workerClient.maximumDuration = value);
  }

  get module() {
    return this._module;
  }

  async ping() {

    let process = this._getConnectedProcess();

    if (process.length > 0) {

      let pingResult = null;
      pingResult = await Promise.all(process.map(workerClient => workerClient.ping()));
      pingResult = pingResult.reduce((minimumResult, result) => Is.null(minimumResult) || result.cpuUsage < minimumResult.cpuUsage ? result : minimumResult, null);

      return pingResult;

    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  async apply(methodName, parameter) {
    return (await this._selectProcess(methodName, parameter)).apply(methodName, parameter);
  }

  async disconnect() {

    let process = this._getConnectedProcess();

    if (process.length > 0) {
      return Promise.all(process.map(workerClient => workerClient.disconnect()));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  async exit(code = 0) {

    let process = this._getConnectedProcess();

    if (process.length > 0) {
      return Promise.all(process.map(workerClient => workerClient.exit(code)));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  async kill(...parameter) {

    let process = this._getConnectedProcess();

    if (process.length > 0) {
      return Promise.all(process.map(workerClient => workerClient.kill(...parameter)));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }}



export { WorkerPool };
//# sourceMappingURL=worker-pool.js.map