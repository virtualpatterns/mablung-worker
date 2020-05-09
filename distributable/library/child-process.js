import { Configuration } from '@virtualpatterns/mablung-configuration';
import { Console } from 'console';
import EventEmitter from 'events';
import FileSystem from 'fs-extra';
import Is from '@pwn/is';
import Stream from 'stream';

import { Null } from './null.js';

import { ChildProcessSignalError } from './error/child-process-signal-error.js';

class ChildProcess extends EventEmitter {

  constructor(userPath, userParameter = {}, userOption = {}) {// 
    super();

    let path = userPath;
    let parameter = Configuration.getParameter(this.defaultParameter, userParameter);
    let option = Configuration.getOption(this.defaultOption, userOption);

    let process = this._createProcess(path, parameter, option);

    this._path = path;
    this._parameter = parameter;
    this._option = option;

    this._process = process;
    this._console = new Null();

    this.attach();

  }

  /* c8 ignore next 1 */
  _createProcess() /* path, parameter, option */{}

  /* c8 ignore next 3 */
  get path() {
    return this._path;
  }

  get defaultParameter() {
    return {};
  }

  /* c8 ignore next 3 */
  get parameter() {
    return this._parameter;
  }

  get defaultOption() {
    return {
      'serialization': 'advanced',
      'stdio': 'pipe' };

  }

  get option() {
    return this._option;
  }

  get console() {
    return this._console;
  }

  get pid() {
    return this._process.pid;
  }

  /* c8 ignore next 3 */
  get isConnected() {
    return this._process.connected;
  }

  attach() {

    this._process.on('message', this._onMessage = message => {
      this._console.log('ChildProcess.on(\'message\', this._onMessage = (message) => { ... })');
      this._console.dir(message);

      try {
        this.onMessage(message);
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    this._process.on('disconnect', this._onDisconnect = () => {
      this._console.log('ChildProcess.on(\'disconnect\', this._onDisconnect = () => { ... })');

      try {
        this.onDisconnect();
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    this._process.on('error', this._onError = error => {
      this._console.error('ChildProcess.on(\'error\', this._onError = (error) => { ... })');
      this._console.error(error);

      try {
        this.detach();
        this.onError(error);
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      } finally {
        this._console = new Null();
      }

    });

    this._process.on('exit', this._onExit = (code, signal) => {
      this._console.log(`ChildProcess.on('exit', this._onExit = (${code}, ${Is.null(signal) ? signal : `'${signal}'`}) => { ... })`);

      try {

        this.detach();

        if (Is.not.null(code)) {
          this.onExit(code);
          /* c8 ignore next 5 */
        } else if (Is.not.null(signal)) {
          this.onTerminate(signal);
        } else {
          this.onExit(0);
        }

        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      } finally {
        this._console = new Null();
      }

    });

  }

  detach() {

    if (this._onExit) {
      this._process.off('exit', this._onExit);
      delete this._onExit;
    }

    if (this._onError) {
      this._process.off('error', this._onError);
      delete this._onError;
    }

    if (this._onDisconnect) {
      this._process.off('disconnect', this._onDisconnect);
      delete this._onDisconnect;
    }

    if (this._onMessage) {
      this._process.off('message', this._onMessage);
      delete this._onMessage;
    }

  }

  writeTo(path, option = { 'autoClose': true, 'emitClose': true, 'encoding': 'utf8', 'flags': 'a+' }) {

    let stream = null;

    switch (true) {
      /* c8 ignore next 3 */
      case path instanceof Stream.Writable:
        stream = path;
        break;
      default:
        stream = FileSystem.createWriteStream(path, option);}


    this._process.stderr.pipe(stream, { 'end': false });
    this._process.stdout.pipe(stream, { 'end': false });

    this._console = new Console({
      'colorMode': false,
      'ignoreErrors': false,
      'stderr': stream,
      'stdout': stream });


  }

  send(message) {
    this._console.log('ChildProcess.send(message) { ... }');
    this._console.dir(message);

    return new Promise((resolve, reject) => {

      this._process.send(message, error => {

        if (Is.null(error)) {
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

    if (this._process.kill(signal)) {
      // do nothing
      /* c8 ignore next 3 */
    } else {
      throw new ChildProcessSignalError(signal, this._process.pid);
    }

  }

  kill(signal = 'SIGINT') {
    this.signal(signal);
  }

  onMessage(message) {
    this.emit('message', message);
  }

  onDisconnect() {
    this.emit('disconnect');
  }

  onError(error) {
    this.emit('error', error);
  }

  onExit(code) {
    this.emit('exit', code);
  }

  onTerminate(signal) {
    this.emit('terminate', signal);
  }}



export { ChildProcess };
//# sourceMappingURL=child-process.js.map