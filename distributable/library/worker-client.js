import { createRequire as _createRequire } from "module";import ChangeCase from 'change-case';
import { Configuration } from '@virtualpatterns/mablung-configuration';

import { ForkedProcess } from './forked-process.js';
import { WorkerClientModuleHandler } from './worker-client-module-handler.js';
import { WorkerClientParameter } from './worker-client-parameter.js';

import { WorkerClientDurationExceededError } from './error/worker-client-duration-exceeded-error.js';
import { WorkerClientRejectedError } from './error/worker-client-rejected-error.js';
import { WorkerClientDisconnectedError } from './error/worker-client-disconnected-error.js';
import { WorkerClientInternalError } from './error/worker-client-internal-error.js';
import { WorkerClientExitedError } from './error/worker-client-exited-error.js';
import { WorkerClientTerminatedError } from './error/worker-client-terminated-error.js';

const { pascalCase: PascalCase } = ChangeCase;
const Require = _createRequire(import.meta.url);

class WorkerClient extends ForkedProcess {

  constructor(...parameter) {
    super(...WorkerClientParameter.getConstructorParameter(...parameter));

    this._isReady = false;
    this._module = null;

  }

  get defaultParameter() {
    return Configuration.merge(super.defaultParameter, { '--worker-server-class-path': Require.resolve('./worker-server.js') });
  }

  get defaultOption() {
    return Configuration.merge(super.defaultOption, { 'maximumDuration': 5000 });
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

          reject(new WorkerClientDurationExceededError(this.maximumDuration));

        }, this.maximumDuration);

      }

    });

  }

  whenRejected(errorClass = WorkerClientRejectedError) {
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

          reject(new WorkerClientDurationExceededError(this.maximumDuration));

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
    return this.send({ 'type': 'ping' });
  }

  async import(url, option = {}) {

    await this.whenReady();
    let returnValue = await this.send({ 'type': 'import', 'url': url, 'option': option });

    this._module = new Proxy(this, WorkerClientModuleHandler);

    return returnValue;

  }

  async apply(methodName, parameter) {
    await this.whenReady();
    return this.send({ 'type': 'apply', 'methodName': methodName, 'parameter': parameter });
  }

  async release(option = {}) {

    await this.whenReady();
    let returnValue = await this.send({ 'type': 'release', 'option': option });

    this._module = null;

    return returnValue;

  }

  async end(option = {}) {
    await this.whenReady();
    await super.send({ 'type': 'end', 'option': option }); // there will be no response
    await this.whenRejected(WorkerClientExitedError);
  }

  async uncaughtException() {
    await this.whenReady();
    await super.send({ 'type': 'uncaughtException' }); // there will be no response
    await this.whenRejected(WorkerClientExitedError);
  }

  async unhandledRejection() {
    await this.whenReady();
    await super.send({ 'type': 'unhandledRejection' }); // there will be no response
    await this.whenRejected(WorkerClientExitedError);
  }

  disconnect() {
    super.disconnect();
    return this.whenRejected(WorkerClientDisconnectedError);
  }

  kill(...parameter) {
    super.kill(...parameter);
    return this.whenRejected(WorkerClientTerminatedError);
  }

  onMessage(message) {

    let methodName = `on${PascalCase(message.type)}`;
    this[methodName](message);

    super.onMessage(message);

  }

  onReady(message) {
    this.emit('ready', message);
  }

  onPing(message) {
    this.emit('ping', message);
  }

  onImport(message) {
    this.emit('import', message);
  }

  onApply(message) {
    this.emit('apply', message);
  }

  onRelease(message) {
    this.emit('release', message);
  }

  onDisconnect() {
    this.onReject(new WorkerClientDisconnectedError());
    super.onDisconnect();
  }

  onError(error) {
    this.onReject(new WorkerClientInternalError(error));
    super.onError(error);
  }

  onExit(code) {
    this.onReject(new WorkerClientExitedError(code));
    super.onExit(code);
  }

  onTerminate(signal) {
    this.onReject(new WorkerClientTerminatedError(signal));
    super.onTerminate(signal);
  }

  onReject(error) {
    this.emit('reject', error);
  }}



export { WorkerClient };
//# sourceMappingURL=worker-client.js.map