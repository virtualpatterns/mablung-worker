import { Configuration } from '@virtualpatterns/mablung-configuration';
import Is from '@pwn/is';
import OS from 'os';

import { ChildProcessPool } from './child-process-pool.js';
import { WorkerClient } from './worker-client.js';
import { WorkerPoolModuleHandler } from './worker-pool-module-handler.js';
import { WorkerPoolParameter } from './worker-pool-parameter.js';

const Process = process;

class WorkerPool extends ChildProcessPool {

  constructor(...parameter) {
    super(...WorkerPoolParameter.getConstructorParameter(...parameter));

    this._module = null;
    this._moduleUrl = null;

  }

  _createProcess(index, path, parameter, option) {
    return new WorkerClient(path, parameter, Configuration.merge(option, { 'env': Configuration.merge(Process.env, { 'WORKER_POOL_INDEX': index }) }));
  }

  get maximumDuration() {
    return this.option.maximumDuration;
  }

  set maximumDuration(value) {
    this.option.maximumDuration = value;
  }

  get module() {
    return this._module;
  }

  get moduleUrl() {
    return this._moduleUrl;
  }

  async selectProcess() /* methodName, parameter */{
    let { index } = await this.ping();
    return this.getProcess(index);
  }

  async ping() {

    let pingResult = await Promise.allSettled(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.ping()));

    let fulfilledPingResult = pingResult.filter(result => result.status === 'fulfilled');

    if (fulfilledPingResult.length > 0) {

      fulfilledPingResult = fulfilledPingResult.map(result => result.value);
      fulfilledPingResult = fulfilledPingResult.reduce((minimumResult, result) => Is.null(minimumResult) || result.cpuUsage < minimumResult.cpuUsage ? result : minimumResult, null);

      return fulfilledPingResult;

    } else {
      throw pingResult[0].reason;
    }

  }

  async import(url, option = {}) {

    let returnValue = await Promise.all(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.import(url, option)));

    this._module = new Proxy(this, WorkerPoolModuleHandler);
    this._moduleUrl = url;

    return returnValue;

  }

  async apply(methodName, parameter) {
    return (await this.selectProcess(methodName, parameter)).process.apply(methodName, parameter);
  }

  async release(option = {}) {

    let returnValue = await Promise.all(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.release(option)));

    this._module = null;
    this._moduleUrl = null;

    return returnValue;

  }

  end(code = 0, option = {}) {
    return Promise.all(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.end(code, option)));
  }

  uncaughtException() {
    return Promise.all(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.uncaughtException()));
  }

  unhandledRejection() {
    return Promise.all(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.unhandledRejection()));
  }

  disconnect() {
    return Promise.all(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.disconnect()));
  }

  kill(...parameter) {
    return Promise.all(this.getConnectedProcess().map(({ process: workerClient }) => workerClient.kill(...parameter)));
  }}



export { WorkerPool };
//# sourceMappingURL=worker-pool.js.map