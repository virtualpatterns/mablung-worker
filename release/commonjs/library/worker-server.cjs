"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _mablungIs = require("@virtualpatterns/mablung-is");

var ModuleChangeCase = _interopRequireWildcard(require("change-case"));

var _workerServerNoIpcChannelError = require("./error/worker-server-no-ipc-channel-error.cjs");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  'pascalCase': PascalCase
} = ModuleChangeCase.default || ModuleChangeCase;
const Process = process;

class WorkerServer {
  constructor(userOption = {}) {
    this._option = _mablungConfiguration.Configuration.getOption(this.defaultOption, userOption);
    this._module = null;
    this._modulePath = null;

    this._attach();
  }

  get defaultOption() {
    return {
      'readyInterval': 1000
    };
  }

  _attach() {
    Process.on('message', this.__onMessage = async message => {
      // console.log('WorkerServer.on(\'message\', this.__onMessage = async (message) => { ... })')
      // console.dir(message)
      try {
        this._detachReadyInterval();

        await this._onMessage(message);
        /* c8 ignore next 3 */
      } catch (error) {
        console.error(error);
      }
    });
    Process.on('disconnect', this.__onDisconnect = () => {
      // console.log('WorkerServer.on(\'disconnect\', this.__onDisconnect = () => { ... })')
      try {
        this._detachReadyInterval();

        this._detachDisconnect();
        /* c8 ignore next 3 */

      } catch (error) {
        console.error(error);
      }
    });
    Process.on('exit', this.__onExit = () =>
    /* code */
    {
      // console.log(`WorkerServer.on('exit', this.__onExit = (${code}) => { ... })`)
      try {
        this._detach();
        /* c8 ignore next 3 */

      } catch (error) {
        console.error(error);
      }
    });
    this._readyInterval = setInterval(async () => {
      try {
        await this.send({
          'type': 'ready'
        });
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
    module = await Promise.resolve(`${path}`).then(s => _interopRequireWildcard(require(s))); // URL.pathToFileURL(path))

    module = module.default || module;
    this._module = module;
    this._modulePath = path;
  }

  send(message) {
    // console.log('WorkerServer.send(message) { ... }')
    // console.dir(message)
    return new Promise((resolve, reject) => {
      if (Process.send) {
        Process.send(message, error => {
          if (_mablungIs.Is.null(error)) {
            resolve();
            /* c8 ignore next 3 */
          } else {
            reject(error);
          }
        });
        /* c8 ignore next 3 */
      } else {
        reject(new _workerServerNoIpcChannelError.WorkerServerNoIPCChannelError());
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
    message.returnValue = {
      'index': Process.env.WORKER_POOL_INDEX ? parseInt(Process.env.WORKER_POOL_INDEX) : 0,
      'pid': Process.pid,
      'cpuUsage': cpuUsage
    };
    await this.send(message);
  }

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

  async _onExit(message) {
    try {
      Process.exit(message.code || 0);
      /* c8 ignore next 3 */
    } catch (error) {
      console.error(error);
    }
  }

}

var _default = WorkerServer;
exports.default = _default;

//# sourceMappingURL=worker-server.cjs.map