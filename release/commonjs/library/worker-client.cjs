"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClient = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _forkedProcess = require("./forked-process.cjs");

var _workerClientModuleHandler = require("./worker-client-module-handler.cjs");

var _workerClientParameter = require("./worker-client-parameter.cjs");

var ModuleChangeCase = _interopRequireWildcard(require("change-case"));

var _workerClientDurationExceededError = require("./error/worker-client-duration-exceeded-error.cjs");

var _workerClientRejectedError = require("./error/worker-client-rejected-error.cjs");

var _workerClientDisconnectedError = require("./error/worker-client-disconnected-error.cjs");

var _workerClientInternalError = require("./error/worker-client-internal-error.cjs");

var _workerClientExitedError = require("./error/worker-client-exited-error.cjs");

var _workerClientKilledError = require("./error/worker-client-killed-error.cjs");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  'pascalCase': PascalCase
} = ModuleChangeCase.default || ModuleChangeCase;

class WorkerClient extends _forkedProcess.ForkedProcess {
  constructor(...parameter) {
    super(..._workerClientParameter.WorkerClientParameter.getConstructorParameter(...parameter));
    this._isReady = false;
    this._module = new Proxy(this, _workerClientModuleHandler.WorkerClientModuleHandler);
  }

  get _defaultOption() {
    return _mablungConfiguration.Configuration.merge(super._defaultOption, {
      'maximumDuration': 10000
    });
  }

  _onMessage(message) {
    let methodName = `_on${PascalCase(message.type)}`;
    this[methodName](message);

    super._onMessage(message);
  }

  _onReady(message) {
    this.emit('ready', message);
  }

  _onPing(message) {
    this.emit('ping', message);
  }

  _onApply(message) {
    this.emit('apply', message);
  }

  _onError(error) {
    this._onReject(new _workerClientInternalError.WorkerClientInternalError(error));

    super._onError(error);
  }

  _onDisconnect() {
    this._onReject(new _workerClientDisconnectedError.WorkerClientDisconnectedError());

    super._onDisconnect();
  }

  _onExit(code) {
    this._onReject(new _workerClientExitedError.WorkerClientExitedError(code));

    super._onExit(code);
  }

  _onKill(signal) {
    this._onReject(new _workerClientKilledError.WorkerClientKilledError(signal));

    super._onKill(signal);
  }

  _onReject(error) {
    this.emit('reject', error);
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

  async whenReady() {
    if (!this._isReady) {
      await this.whenMessageType('ready');
      this._isReady = true;
    }
  }

  whenMessageType(type) {
    // this.console.log(`WorkerClient.whenMessageType('${type}') { ... }`)
    return new Promise((resolve, reject) => {
      let onMessage = null;
      let onReject = null;
      let timeout = null;
      this.on('message', onMessage = message => {
        // this.console.log('WorkerClient.on(\'message\', onMessage = (message) => { ... })')
        // this.console.dir(message)
        if (message.type === type) {
          this.off('message', onMessage);
          onMessage = null;
          this.off('reject', onReject);
          onReject = null;

          if (this.maximumDuration > 0) {
            clearTimeout(timeout);
            timeout = null;
          }

          resolve(message);
        }
      });
      this.on('reject', onReject = error => {
        // this.console.error('WorkerClient.on(\'reject\', onReject = (error) => { ... })')
        // this.console.error(error)
        this.off('message', onMessage);
        onMessage = null;
        this.off('reject', onReject);
        onReject = null;

        if (this.maximumDuration > 0) {
          clearTimeout(timeout);
          timeout = null;
        }

        reject(error);
      });

      if (this.maximumDuration > 0) {
        timeout = setTimeout(() => {
          this.off('message', onMessage);
          onMessage = null;
          this.off('reject', onReject);
          onReject = null;
          clearTimeout(timeout);
          timeout = null;
          reject(new _workerClientDurationExceededError.WorkerClientDurationExceededError(this.maximumDuration));
        }, this.maximumDuration);
      }
    });
  }

  whenRejected(errorClass = _workerClientRejectedError.WorkerClientRejectedError) {
    // this.console.log(`WorkerClient.whenRejected(${errorClass.name}) { ... }`)
    return new Promise((resolve, reject) => {
      let onReject = null;
      let timeout = null;
      this.on('reject', onReject = error => {
        // this.console.error('WorkerClient.on(\'reject\', onReject = (error) => { ... })')
        // this.console.error(error)
        if (error instanceof errorClass) {
          this.off('reject', onReject);
          onReject = null;

          if (this.maximumDuration > 0) {
            clearTimeout(timeout);
            timeout = null;
          }

          resolve(error);
        }
      });

      if (this.maximumDuration > 0) {
        timeout = setTimeout(() => {
          this.off('reject', onReject);
          onReject = null;
          clearTimeout(timeout);
          timeout = null;
          reject(new _workerClientDurationExceededError.WorkerClientDurationExceededError(this.maximumDuration));
        }, this.maximumDuration);
      }
    });
  }

  async send(requestMessage) {
    let responsePromise = this.whenMessageType(requestMessage.type);
    let sendPromise = super.send(requestMessage);
    let [, responseMessage] = await Promise.all([sendPromise, responsePromise]);

    if (responseMessage.error) {
      throw responseMessage.error;
    }

    return responseMessage.returnValue;
  }

  async ping() {
    await this.whenReady();
    return this.send({
      'type': 'ping'
    });
  }

  async apply(methodName, parameter) {
    await this.whenReady();
    return this.send({
      'type': 'apply',
      'methodName': methodName,
      'parameter': parameter
    });
  }

  disconnect() {
    super.disconnect();
    return this.whenRejected(_workerClientDisconnectedError.WorkerClientDisconnectedError);
  }

  async exit(code = 0) {
    await this.whenReady();
    await super.send({
      'type': 'exit',
      'code': code
    }); // there will be no response

    await this.whenRejected(_workerClientExitedError.WorkerClientExitedError);
  }

  kill(...parameter) {
    super.kill(...parameter);
    return this.whenRejected(_workerClientKilledError.WorkerClientKilledError);
  }

}

exports.WorkerClient = WorkerClient;

//# sourceMappingURL=worker-client.cjs.map