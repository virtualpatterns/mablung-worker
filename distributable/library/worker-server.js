import ChangeCase from 'change-case';
import { Configuration } from '@virtualpatterns/mablung-configuration';
import Is from '@pwn/is';

import { WorkerServerNoIPCChannelError } from './error/worker-server-no-ipc-channel-error.js';
import { WorkerServerModuleImportedError } from './error/worker-server-module-imported-error.js';
import { WorkerServerNoModuleImportedError } from './error/worker-server-no-module-imported-error.js';
import { WorkerServerUncaughtExceptionError } from './error/worker-server-uncaught-exception-error.js';
import { WorkerServerUnhandledRejectionError } from './error/worker-server-unhandled-rejection-error.js';
import { WorkerServerModuleExportError } from './error/worker-server-module-export-error.js';

const { pascalCase: PascalCase } = ChangeCase;
const Process = process;

class WorkerServer {

  constructor(userOption = {}) {

    this._option = Configuration.getOption(this.defaultOption, userOption);

    this._module = null;
    this._moduleUrl = null;

    this.attach();

  }

  get defaultOption() {
    return { 'readyInterval': 1000 };
  }

  attach() {

    Process.on('message', this._onMessage = async message => {
      console.log('WorkerServer.on(\'message\', this._onMessage = async (message) => { ... })');
      console.dir(message);

      try {
        this._detachReadyInterval();
        await this.onMessage(message);
        /* c8 ignore next 3 */
      } catch (error) {
        console.error(error);
      }

    });

    Process.on('disconnect', this._onDisconnect = () => {
      console.log('WorkerServer.on(\'disconnect\', this._onDisconnect = () => { ... })');

      try {
        this._detachReadyInterval();
        this._detachDisconnect();
        /* c8 ignore next 3 */
      } catch (error) {
        console.error(error);
      }

    });

    Process.on('exit', this._onExit = code => {
      console.log(`WorkerServer.on('exit', this._onExit = (${code}) => { ... })`);

      try {
        this.detach();
        /* c8 ignore next 3 */
      } catch (error) {
        console.error(error);
      }

    });

    this._readyInterval = setInterval(async () => {

      try {
        await this.send({ 'type': 'ready' });
        /* c8 ignore next 4 */
      } catch (error) {
        this._detachReadyInterval();
        console.error(error);
      }

    }, this._option.readyInterval);

  }

  _detachReadyInterval() {

    if (this._readyInterval) {
      clearInterval(this._readyInterval);
      delete this._readyInterval;
    }

  }

  _detachDisconnect() {

    if (this._onDisconnect) {
      Process.off('disconnect', this._onDisconnect);
      delete this._onDisconnect;
    }

  }

  detach() {

    this._detachReadyInterval();

    if (this._onExit) {
      Process.off('exit', this._onExit);
      delete this._onExit;
    }

    this._detachDisconnect();

    if (this._onMessage) {
      Process.off('message', this._onMessage);
      delete this._onMessage;
    }

  }

  send(message) {
    console.log('WorkerServer.send(message) { ... }');
    console.dir(message);

    return new Promise((resolve, reject) => {

      if (Process.send) {

        Process.send(message, error => {

          if (Is.null(error)) {
            resolve();
            /* c8 ignore next 3 */
          } else {
            reject(error);
          }

        });

        /* c8 ignore next 3 */
      } else {
        reject(new WorkerServerNoIPCChannelError());
      }

    });

  }

  onMessage(message) {
    let methodName = `on${PascalCase(message.type)}`;
    return this[methodName](message);
  }

  onPing(message) {
    return this.send(message);
  }

  async onImport(message) {

    try {

      if (Is.null(this._module)) {

        let url = message.url;

        let module = null;
        module = await import(url);
        module = module.default ? module.default : module;

        this._module = module;
        this._moduleUrl = url;

        delete message.error;

      } else {
        throw new WorkerServerModuleImportedError(this._moduleUrl);
      }

    } catch (error) {
      message.error = error;
    }

    await this.send(message);

  }

  async onApply(message) {

    try {

      if (Is.not.null(this._module)) {

        let method = this._module[message.methodName];

        if (method) {

          let returnValue = null;
          returnValue = method.apply(this._module, message.parameter);
          returnValue = returnValue instanceof Promise ? await returnValue : returnValue;

          delete message.error;
          message.returnValue = returnValue;

        } else {
          throw new WorkerServerModuleExportError(this._moduleUrl, message.methodName);
        }

      } else {
        throw new WorkerServerNoModuleImportedError();
      }

    } catch (error) {

      message.error = error;
      delete message.returnValue;

    }

    await this.send(message);

  }

  async onRelease(message) {

    try {

      if (Is.not.null(this._module)) {

        this._module = null;
        this._moduleUrl = null;

        delete message.error;

      } else {
        throw new WorkerServerNoModuleImportedError();
      }

    } catch (error) {
      message.error = error;
    }

    await this.send(message);

  }

  onEnd() {
    Process.exit();
  }

  onUncaughtException() {
    setImmediate(() => {throw new WorkerServerUncaughtExceptionError();});
  }

  onUnhandledRejection() {
    setImmediate(() => Promise.reject(new WorkerServerUnhandledRejectionError()));
  }}



export default WorkerServer;
//# sourceMappingURL=worker-server.js.map