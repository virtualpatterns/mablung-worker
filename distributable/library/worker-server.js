import ChangeCase from 'change-case';
import { Configuration } from '@virtualpatterns/mablung-configuration';
import Is from '@pwn/is';
import OS from 'os';

import { WorkerServerNoIPCChannelError } from './error/worker-server-no-ipc-channel-error.js';
// import { WorkerServerModuleImportedError } from './error/worker-server-module-imported-error.js'
// import { WorkerServerNoModuleImportedError } from './error/worker-server-no-module-imported-error.js'
// import { WorkerServerUncaughtExceptionError } from './error/worker-server-uncaught-exception-error.js'
// import { WorkerServerUnhandledRejectionError } from './error/worker-server-unhandled-rejection-error.js'
// import { WorkerServerModuleExportError } from './error/worker-server-module-export-error.js'

const { pascalCase: PascalCase } = ChangeCase;
const Process = process;

class WorkerServer {

  constructor(userOption = {}) {

    this._option = Configuration.getOption(this.defaultOption, userOption);

    this._module = null;
    this._modulePath = null;

    this._attach();

  }

  get defaultOption() {
    return { 'readyInterval': 1000 };
  }

  _attach() {

    Process.on('message', this.__onMessage = async message => {
      console.log('WorkerServer.on(\'message\', this.__onMessage = async (message) => { ... })');
      console.dir(message);

      try {
        this._detachReadyInterval();
        await this._onMessage(message);
        /* c8 ignore next 3 */
      } catch (error) {
        console.error(error);
      }

    });

    Process.on('disconnect', this.__onDisconnect = () => {
      console.log('WorkerServer.on(\'disconnect\', this.__onDisconnect = () => { ... })');

      try {
        this._detachReadyInterval();
        this._detachDisconnect();
        /* c8 ignore next 3 */
      } catch (error) {
        console.error(error);
      }

    });

    Process.on('exit', this.__onExit = code => {
      console.log(`WorkerServer.on('exit', this.__onExit = (${code}) => { ... })`);

      try {
        this._detach();
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

    if (this.__onDisconnect) {
      Process.off('disconnect', this.__onDisconnect);
      delete this.__onDisconnect;
    }

  }

  _detach() {

    this._detachReadyInterval();

    if (this.__onExit) {
      Process.off('exit', this.__onExit);
      delete this.__onExit;
    }

    this._detachDisconnect();

    if (this.__onMessage) {
      Process.off('message', this.__onMessage);
      delete this.__onMessage;
    }

  }

  async import(path) {

    let module = null;
    module = await import(path);
    module = module.default ? module.default : module;

    this._module = module;
    this._modulePath = path;

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

  _onMessage(message) {
    let methodName = `_on${PascalCase(message.type)}`;
    return this[methodName](message);
  }

  async _onPing(message) {

    let cpuUsage = null;
    cpuUsage = Process.cpuUsage();
    cpuUsage = (cpuUsage.user + cpuUsage.system) / 2.0;

    message.returnValue = { 'index': Process.env.WORKER_POOL_INDEX ? parseInt(Process.env.WORKER_POOL_INDEX) : 0, 'pid': Process.pid, 'cpuUsage': cpuUsage };

    await this.send(message);

  }

  // async onImport(message) {

  //   try {

  //     if (Is.null(this._module)) {

  //       let url = message.url
  //       let option = message.option

  //       let module = null
  //       module = await import(url)
  //       module = module.default ? module.default : module

  //       let onImport = module['onImport']

  //       if (onImport) {

  //         let returnValue = null
  //         returnValue = onImport.apply(module, [ option ])
  //         returnValue = returnValue instanceof Promise ? await returnValue : returnValue

  //         message.returnValue = returnValue

  //       }

  //       delete message.error

  //       this._module = module
  //       this._modulePath = url

  //     } else {
  //       throw new WorkerServerModuleImportedError(this._modulePath)
  //     }

  //   } catch (error) {

  //     message.error = error
  //     delete message.returnValue

  //   }

  //   await this.send(message)

  // }

  async _onApply(message) {

    try {

      let returnValue = null;
      returnValue = this._module[message.methodName].apply(this._module, message.parameter);
      returnValue = returnValue instanceof Promise ? await returnValue : returnValue;

      delete message.error;
      message.returnValue = returnValue;

    } catch (error) {

      message.error = error;
      delete message.returnValue;

    }

    await this.send(message);

  }

  // async onApply(message) {

  //   try {

  //     if (Is.not.null(this._module)) {

  //       let method = this._module[message.methodName]

  //       if (method) {

  //         let returnValue = null
  //         returnValue = method.apply(this._module, message.parameter)
  //         returnValue = returnValue instanceof Promise ? await returnValue : returnValue

  //         delete message.error
  //         message.returnValue = returnValue

  //       } else {
  //         throw new WorkerServerModuleExportError(this._modulePath, message.methodName)
  //       }

  //     } else {
  //       throw new WorkerServerNoModuleImportedError()
  //     }

  //   } catch (error) {

  //     message.error = error
  //     delete message.returnValue

  //   }

  //   await this.send(message)

  // }

  // async onRelease(message) {

  //   try {

  //     if (Is.not.null(this._module)) {

  //       let option = message.option
  //       let onRelease = this._module['onRelease']

  //       if (onRelease) {

  //         let returnValue = null
  //         returnValue = onRelease.apply(this._module, [ option ])
  //         returnValue = returnValue instanceof Promise ? await returnValue : returnValue

  //         message.returnValue = returnValue

  //       }

  //       delete message.error

  //       this._module = null
  //       this._modulePath = null

  //     } else {
  //       throw new WorkerServerNoModuleImportedError()
  //     }

  //   } catch (error) {
  //     message.error = error
  //   }

  //   await this.send(message)

  // }

  async _onEnd(message) {

    try {

      if (Is.not.null(this._module)) {

        let code = message.code;
        let option = message.option;
        let onEnd = this._module['onEnd'];

        if (onEnd) {

          let returnValue = null;
          returnValue = onEnd.apply(this._module, [code, option]);
          returnValue = returnValue instanceof Promise ? await returnValue : returnValue;

          message.returnValue = returnValue;

        }

        delete message.error;

      }

      Process.exit(message.code || 0);

      /* c8 ignore next 3 */
    } catch (error) {
      console.error(error);
    }

  }

  // onUncaughtException() {
  //   setImmediate(() => { throw new WorkerServerUncaughtExceptionError() })
  // }

  // onUnhandledRejection() {
  //   setImmediate(() => Promise.reject(new WorkerServerUnhandledRejectionError()))
  // }
}


export default WorkerServer;
//# sourceMappingURL=worker-server.js.map