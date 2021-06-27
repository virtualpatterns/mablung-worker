"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerPool = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _mablungIs = require("@virtualpatterns/mablung-is");

var _childProcessPool = require("./child-process-pool.cjs");

var _workerClient = require("./worker-client.cjs");

var _workerPoolModuleHandler = require("./worker-pool-module-handler.cjs");

var _workerPoolParameter = require("./worker-pool-parameter.cjs");

var _workerPoolDisconnectedError = require("./error/worker-pool-disconnected-error.cjs");

const Process = process;

class WorkerPool extends _childProcessPool.ChildProcessPool {
  constructor(...parameter) {
    super(..._workerPoolParameter.WorkerPoolParameter.getConstructorParameter(...parameter));
    this._module = new Proxy(this, _workerPoolModuleHandler.WorkerPoolModuleHandler);
  }

  _createProcess(index, path, parameter, option) {
    return new _workerClient.WorkerClient(path, parameter, _mablungConfiguration.Configuration.merge(option, {
      'env': _mablungConfiguration.Configuration.merge(Process.env, {
        'WORKER_POOL_INDEX': index
      })
    }));
  }

  async _selectProcess()
  /* methodName, parameter */
  {
    let {
      index
    } = await this.ping();
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
      pingResult = pingResult.reduce((minimumResult, result) => _mablungIs.Is.null(minimumResult) || result.cpuUsage < minimumResult.cpuUsage ? result : minimumResult, null);
      return pingResult;
    } else {
      throw new _workerPoolDisconnectedError.WorkerPoolDisconnectedError();
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
      throw new _workerPoolDisconnectedError.WorkerPoolDisconnectedError();
    }
  }

  async exit(code = 0) {
    let process = this._getConnectedProcess();

    if (process.length > 0) {
      return Promise.all(process.map(workerClient => workerClient.exit(code)));
    } else {
      throw new _workerPoolDisconnectedError.WorkerPoolDisconnectedError();
    }
  }

  async kill(...parameter) {
    let process = this._getConnectedProcess();

    if (process.length > 0) {
      return Promise.all(process.map(workerClient => workerClient.kill(...parameter)));
    } else {
      throw new _workerPoolDisconnectedError.WorkerPoolDisconnectedError();
    }
  }

}

exports.WorkerPool = WorkerPool;

//# sourceMappingURL=worker-pool.cjs.map