import { Configuration } from '@virtualpatterns/mablung-configuration';
import Is from '@pwn/is';

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

  async _selectProcessInformation() /* methodName, parameter */{
    let { index } = await this.ping();
    return this._getProcessInformation(index);
  }

  get maximumDuration() {
    return this.option.maximumDuration;
  }

  set maximumDuration(value) {
    this.option.maximumDuration = value;
    this._getConnectedProcessInformation().forEach(({ process: workerClient }) => workerClient.maximumDuration = value);
  }

  get module() {
    return this._module;
  }

  async ping() {

    let processInformation = this._getConnectedProcessInformation();

    if (processInformation.length > 0) {

      let pingResult = null;
      pingResult = await Promise.all(processInformation.map(({ process: workerClient }) => workerClient.ping()));
      pingResult = pingResult.reduce((minimumResult, result) => Is.null(minimumResult) || result.cpuUsage < minimumResult.cpuUsage ? result : minimumResult, null);

      return pingResult;

    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  // async import(url, option = {}) {

  //   let processInformation = this._getConnectedProcessInformation()

  //   if (processInformation.length > 0) {

  //     let returnValue = await Promise.all(processInformation.map(({ process: workerClient }) => workerClient.import(url, option)))

  //     this._module = new Proxy(this, WorkerPoolModuleHandler)
  //     this._moduleUrl = url

  //     return returnValue

  //   } else {
  //     throw new WorkerPoolDisconnectedError()
  //   }

  // }

  async apply(methodName, parameter) {
    return (await this._selectProcessInformation(methodName, parameter)).process.apply(methodName, parameter);
  }

  // async release(option = {}) {

  //   let processInformation = this._getConnectedProcessInformation()

  //   if (processInformation.length > 0) {

  //     let returnValue = await Promise.all(processInformation.map(({ process: workerClient }) => workerClient.release(option)))

  //     this._module = null
  //     this._moduleUrl = null

  //     return returnValue

  //   } else {
  //     throw new WorkerPoolDisconnectedError()
  //   }

  // }

  end(code = 0, option = {}) {

    let processInformation = this._getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.end(code, option)));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  // uncaughtException() {

  //   let processInformation = this._getConnectedProcessInformation()

  //   if (processInformation.length > 0) {
  //     return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.uncaughtException()))
  //   } else {
  //     throw new WorkerPoolDisconnectedError()
  //   }

  // }

  // unhandledRejection() {

  //   let processInformation = this._getConnectedProcessInformation()

  //   if (processInformation.length > 0) {
  //     return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.unhandledRejection()))
  //   } else {
  //     throw new WorkerPoolDisconnectedError()
  //   }

  // }

  disconnect() {

    let processInformation = this._getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.disconnect()));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  kill(...parameter) {

    let processInformation = this._getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.kill(...parameter)));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }}



export { WorkerPool };
//# sourceMappingURL=worker-pool.js.map