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
    this.getConnectedProcessInformation().forEach(({ process: workerClient }) => workerClient.maximumDuration = value);
  }

  get module() {
    return this._module;
  }

  get moduleUrl() {
    return this._moduleUrl;
  }

  async selectProcessInformation() /* methodName, parameter */{
    let { index } = await this.ping();
    return this.getProcessInformation(index);
  }

  async ping() {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {

      let pingResult = await Promise.allSettled(processInformation.map(({ process: workerClient }) => workerClient.ping()));

      let fulfilledPingResult = pingResult.filter(result => result.status === 'fulfilled');

      if (fulfilledPingResult.length > 0) {

        fulfilledPingResult = fulfilledPingResult.map(result => result.value);
        fulfilledPingResult = fulfilledPingResult.reduce((minimumResult, result) => Is.null(minimumResult) || result.cpuUsage < minimumResult.cpuUsage ? result : minimumResult, null);

        return fulfilledPingResult;

      } else {
        throw pingResult[0].reason;
      }

    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  async import(url, option = {}) {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {

      let returnValue = await Promise.all(processInformation.map(({ process: workerClient }) => workerClient.import(url, option)));

      this._module = new Proxy(this, WorkerPoolModuleHandler);
      this._moduleUrl = url;

      return returnValue;

    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  async apply(methodName, parameter) {
    return (await this.selectProcessInformation(methodName, parameter)).process.apply(methodName, parameter);
  }

  async release(option = {}) {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {

      let returnValue = await Promise.all(processInformation.map(({ process: workerClient }) => workerClient.release(option)));

      this._module = null;
      this._moduleUrl = null;

      return returnValue;

    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  end(code = 0, option = {}) {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.end(code, option)));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  uncaughtException() {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.uncaughtException()));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  unhandledRejection() {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.unhandledRejection()));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  disconnect() {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.disconnect()));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }

  kill(...parameter) {

    let processInformation = this.getConnectedProcessInformation();

    if (processInformation.length > 0) {
      return Promise.all(processInformation.map(({ process: workerClient }) => workerClient.kill(...parameter)));
    } else {
      throw new WorkerPoolDisconnectedError();
    }

  }}



export { WorkerPool };
//# sourceMappingURL=worker-pool.js.map