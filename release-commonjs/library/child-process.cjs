"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChildProcess = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _console = require("console");

var _mablungIs = require("@virtualpatterns/mablung-is");

var _events = _interopRequireDefault(require("events"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _stream = _interopRequireDefault(require("stream"));

var _null = require("./null.cjs");

var _childProcessSignalError = require("./error/child-process-signal-error.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChildProcess extends _events.default {
  constructor(userPath, userParameter = {}, userOption = {}) {
    // 
    super();
    let processPath = userPath;

    let processParameter = _mablungConfiguration.Configuration.getParameter(this._defaultParameter, userParameter);

    let processOption = _mablungConfiguration.Configuration.getOption(this._defaultOption, userOption);

    let process = this._createProcess(processPath, processParameter, processOption);

    this._processPath = processPath;
    this._processParameter = processParameter;
    this._processOption = processOption;
    this._process = process;
    this._console = new _null.Null();
    this._stream = null;
    this._streamOption = null;

    this._attach();
  }
  /* c8 ignore next 1 */


  _createProcess()
  /* path, parameter, option */
  {}

  _attach() {
    this._process.on('message', this.__onMessage = message => {
      // this._console.log('ChildProcess.on(\'message\', this.__onMessage = (message) => { ... })')
      // this._console.dir(message)
      try {
        this._onMessage(message);
        /* c8 ignore next 3 */

      } catch (error) {
        this._console.error(error);
      }
    });

    this._process.on('error', this.__onError = error => {
      this._console.error('ChildProcess.on(\'error\', this.__onError = (error) => { ... })');

      this._console.error(error);

      try {
        this._detach();

        this._onError(error);
        /* c8 ignore next 3 */

      } catch (error) {
        this._console.error(error);
      } finally {
        this._console = new _null.Null();
      }
    });

    this._process.on('disconnect', this.__onDisconnect = () => {
      this._console.log('ChildProcess.on(\'disconnect\', this.__onDisconnect = () => { ... })');

      try {
        this._onDisconnect();
        /* c8 ignore next 3 */

      } catch (error) {
        this._console.error(error);
      }
    });

    this._process.on('exit', this.__onExit = (code, signal) => {
      this._console.log(`ChildProcess.on('exit', this.__onExit = (${code}, ${_mablungIs.Is.null(signal) ? signal : `'${signal}'`}) => { ... })`);

      try {
        this._detach();

        if (_mablungIs.Is.not.null(code)) {
          this._onExit(code);
          /* c8 ignore next 5 */

        } else if (_mablungIs.Is.not.null(signal)) {
          this._onKill(signal);
        } else {
          this._onExit(0);
        }
        /* c8 ignore next 3 */

      } catch (error) {
        this._console.error(error);
      } finally {
        this._console = new _null.Null();
      }
    });
  }

  _detach() {
    if (this.__onExit) {
      this._process.off('exit', this.__onExit);

      delete this.__onExit;
    }

    if (this.__onDisconnect) {
      this._process.off('disconnect', this.__onDisconnect);

      delete this.__onDisconnect;
    }

    if (this.__onError) {
      this._process.off('error', this.__onError);

      delete this.__onError;
    }

    if (this.__onMessage) {
      this._process.off('message', this.__onMessage);

      delete this.__onMessage;
    }
  }

  _onMessage(message) {
    this.emit('message', message);
  }

  _onError(error) {
    this.emit('error', error);
  }

  _onDisconnect() {
    this.emit('disconnect');
  }

  _onExit(code) {
    this.emit('exit', code);
  }

  _onKill(signal) {
    this.emit('kill', signal);
  }
  /* c8 ignore next 3 */


  get path() {
    return this._processPath;
  }

  get _defaultParameter() {
    return {};
  }
  /* c8 ignore next 3 */


  get parameter() {
    return this._processParameter;
  }

  get _defaultOption() {
    return {
      'serialization': 'advanced',
      'stdio': 'pipe'
    };
  }

  get option() {
    return this._processOption;
  }

  get console() {
    return this._console;
  }

  get pid() {
    return this._process.pid;
  }

  get isConnected() {
    return this._process.connected;
  }

  writeTo(path, option = {
    'autoClose': true,
    'emitClose': true,
    'encoding': 'utf8',
    'flags': 'a+'
  }) {
    let stream = null;

    switch (true) {
      /* c8 ignore next 3 */
      case path instanceof _stream.default.Writable:
        stream = path;
        break;

      default:
        _fsExtra.default.ensureDirSync(_path.default.dirname(path));

        stream = _fsExtra.default.createWriteStream(path, option);
    }

    this._process.stderr.pipe(stream, {
      'end': false
    });

    this._process.stdout.pipe(stream, {
      'end': false
    });

    this._console = new _console.Console({
      'colorMode': false,
      'ignoreErrors': false,
      'stderr': stream,
      'stdout': stream
    });
    this._stream = stream;
    this._streamOption = option;
  }

  send(message) {
    // this._console.log('ChildProcess.send(message) { ... }')
    // this._console.dir(message)
    return new Promise((resolve, reject) => {
      this._process.send(message, error => {
        if (_mablungIs.Is.null(error)) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  disconnect() {
    this._process.disconnect();
  }

  signal(signal) {
    if (this._process.kill(signal)) {// do nothing

      /* c8 ignore next 3 */
    } else {
      throw new _childProcessSignalError.ChildProcessSignalError(signal, this._process.pid);
    }
  }

  kill(signal = 'SIGINT') {
    this.signal(signal);
  }

}

exports.ChildProcess = ChildProcess;
//# sourceMappingURL=child-process.cjs.map