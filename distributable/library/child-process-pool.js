import { Configuration } from '@virtualpatterns/mablung-configuration';
import { Console } from 'console';
import EventEmitter from 'events';
import FileSystem from 'fs-extra';
// import Is from '@pwn/is'
import OS from 'os';
import Stream from 'stream';

import { ChildProcess } from './child-process.js';
import { Null } from './null.js';

const Process = process;

class ChildProcessPool extends EventEmitter {

  constructor(userPath, userParameter = {}, userOption = {}) {
    super();

    let path = userPath;
    let parameter = Configuration.getParameter(this.defaultParameter, userParameter);
    let option = Configuration.getOption(this.defaultOption, userOption);

    let numberOfProcess = option.numberOfProcess || OS.cpus().length - 1;
    let process = [];

    for (let index = 0; index < numberOfProcess; index++) {

      let processInformation = this._createProcessInformation(index, path, parameter, option);

      this._attachProcess(processInformation);

      process.push(processInformation);

    }

    this._processPath = path;
    this._processParameter = parameter;
    this._processOption = option;

    this._process = process;

    this._console = new Null();
    this._stream = null;
    this._streamOption = null;

  }

  _createProcessInformation(index, path, parameter, option) {

    return {
      'index': index,
      'numberOfCreate': 0,
      'process': this._createProcess(index, path, parameter, option) };


  }

  _createProcess(index, path, parameter, option) {
    return new ChildProcess(path, parameter, Configuration.merge(option, { 'env': Configuration.merge(Process.env, { 'CHILD_PROCESS_POOL_INDEX': index }) }));
  }

  _recreateProcess(processInformation) {

    let index = processInformation.index;

    let processPath = this._processPath;
    let processParameter = this._processParameter;
    let processOption = this._processOption;

    let stream = this._stream;
    let streamOption = this._streamOption;

    this._detachProcess(processInformation);

    if (processInformation.numberOfCreate < (processOption.maximumNumberOfCreate || Infinity)) {

      processInformation.process = this._createProcess(index, processPath, processParameter, processOption);
      processInformation.numberOfCreate++;

      this._attachProcess(processInformation);

      if (stream) {
        processInformation.process.writeTo(stream, streamOption);
      }

    }

  }

  _attachProcess(processInformation) {

    processInformation.process.on('disconnect', processInformation._onDisconnect = () => {
      this._console.log('ChildProcessPool.on(\'disconnect\', processInformation._onDisconnect = () => { ... })');

      try {
        this._onDisconnect(processInformation);
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    processInformation.process.on('error', processInformation._onError = error => {
      this._console.error('ChildProcessPool.on(\'error\', processInformation._onError = (error) => { ... })');
      this._console.error(error);

      try {
        this._detachProcess(processInformation);
        this._onError(processInformation, error);
        this._recreateProcess(processInformation);
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    processInformation.process.on('exit', processInformation._onExit = code => {
      this._console.log(`ChildProcessPool.on('exit', processInformation._onExit = (${code}) => { ... })`);

      try {

        this._detachProcess(processInformation);
        this._onExit(processInformation, code);

        if (code > 0) {
          this._recreateProcess(processInformation);
        }

        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    processInformation.process.on('terminate', processInformation._onTerminate = signal => {
      this._console.log(`ChildProcessPool.on('terminate', processInformation._onTerminate = ('${signal}') => { ... })`);

      try {
        this._detachProcess(processInformation);
        this._onTerminate(processInformation, signal);
        this._recreateProcess(processInformation);
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

  }

  _detachProcess(processInformation) {

    let process = processInformation.process;

    if (processInformation._onTerminate) {
      process.off('terminate', processInformation._onTerminate);
      delete processInformation._onTerminate;
    }

    if (processInformation._onExit) {
      process.off('exit', processInformation._onExit);
      delete processInformation._onExit;
    }

    if (processInformation._onError) {
      process.off('error', processInformation._onError);
      delete processInformation._onError;
    }

    if (processInformation._onDisconnect) {
      process.off('disconnect', processInformation._onDisconnect);
      delete processInformation._onDisconnect;
    }

  }

  _onDisconnect(processInformation) {
    this.emit('disconnect', processInformation);
  }

  _onError(processInformation, error) {
    this.emit('error', processInformation, error);
  }

  _onExit(processInformation, code) {
    this.emit('exit', processInformation, code);
  }

  _onTerminate(processInformation, signal) {
    this.emit('terminate', processInformation, signal);
  }

  get defaultParameter() {
    return {};
  }

  /* c8 ignore next 3 */
  get parameter() {
    return this._processParameter;
  }

  get defaultOption() {
    return {
      'maximumNumberOfCreate': 3,
      'numberOfProcess': OS.cpus().length - 1 };

  }

  get option() {
    return this._processOption;
  }

  get maximumNumberOfCreate() {
    return this._processOption.maximumNumberOfCreate;
  }

  get numberOfProcess() {
    return this._processOption.numberOfProcess;
  }

  getConnectedProcess() {
    return this._process.
    filter(({ process }) => process.isConnected);
  }

  selectProcess() {}

  getProcess(index) {
    return this._process[index];
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


    this._process.forEach(({ process }) => process.writeTo(stream, option));

    this._console = new Console({
      'colorMode': false,
      'ignoreErrors': false,
      'stderr': stream,
      'stdout': stream });


    this._stream = stream;
    this._streamOption = option;

  }

  disconnect() {
    this.getConnectedProcess().forEach(({ process }) => process.disconnect());
  }

  signal(signal) {
    this.getConnectedProcess().forEach(({ process }) => process.signal(signal));
  }

  kill(signal = 'SIGINT') {
    this.signal(signal);
  }}



export { ChildProcessPool };
//# sourceMappingURL=child-process-pool.js.map