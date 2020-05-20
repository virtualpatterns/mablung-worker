import { Configuration } from '@virtualpatterns/mablung-configuration';
import { Console } from 'console';
import EventEmitter from 'events';
import FileSystem from 'fs-extra';
import Is from '@pwn/is';
import OS from 'os';
import Stream from 'stream';

import { ChildProcess } from './child-process.js';
import { Null } from './null.js';

const Process = process;

class ChildProcessPool extends EventEmitter {

  constructor(userPath, userParameter = {}, userOption = {}) {
    super();

    let path = userPath;
    let parameter = Configuration.getParameter(this._defaultParameter, userParameter);
    let option = Configuration.getOption(this._defaultOption, userOption);

    let numberOfProcess = option.numberOfProcess || OS.cpus().length - 1;
    let processInformation = [];

    for (let index = 0; index < numberOfProcess; index++) {
      processInformation.push(this._createProcessInformation(index, path, parameter, option));
    }

    this._processPath = path;
    this._processParameter = parameter;
    this._processOption = option;

    this._processInformation = processInformation;

    this._console = new Null();

    this._stream = null;
    this._streamOption = null;

    this._processInformation.forEach(processInformation => this._attach(processInformation));

  }

  _createProcessInformation(index, path, parameter, option) {

    return {
      'index': index,
      'numberOfCreate': 1,
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

    this._detach(processInformation);

    if (processInformation.numberOfCreate < processOption.maximumNumberOfCreate) {

      processInformation.process = this._createProcess(index, processPath, processParameter, processOption);
      processInformation.numberOfCreate++;

      this._attach(processInformation);

      if (Is.not.null(stream)) {
        processInformation.process.writeTo(stream, streamOption);
      }

    }

  }

  _attach(processInformation) {

    let { process } = processInformation;

    process.on('disconnect', processInformation.__onDisconnect = () => {
      this._console.log('ChildProcessPool.on(\'disconnect\', processInformation.__onDisconnect = () => { ... })');

      try {
        this._onDisconnect(processInformation);
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    process.on('error', processInformation.__onError = error => {
      this._console.error('ChildProcessPool.on(\'error\', processInformation.__onError = (error) => { ... })');
      this._console.error(error);

      try {
        this._onError(processInformation, error);
        // do not recreate on error
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    process.on('exit', processInformation.__onExit = code => {
      this._console.log(`ChildProcessPool.on('exit', processInformation.__onExit = (${code}) => { ... })`);

      try {

        this._onExit(processInformation, code);

        if (code > 0) {
          this._recreateProcess(processInformation);
        }

        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

    process.on('terminate', processInformation.__onTerminate = signal => {
      this._console.log(`ChildProcessPool.on('terminate', processInformation.__onTerminate = ('${signal}') => { ... })`);

      try {
        this._onTerminate(processInformation, signal);
        this._recreateProcess(processInformation);
        /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error);
      }

    });

  }

  _detach(processInformation) {

    let { process } = processInformation;

    if (processInformation.__onTerminate) {
      process.off('terminate', processInformation.__onTerminate);
      delete processInformation.__onTerminate;
    }

    if (processInformation.__onExit) {
      process.off('exit', processInformation.__onExit);
      delete processInformation.__onExit;
    }

    if (processInformation.__onError) {
      process.off('error', processInformation.__onError);
      delete processInformation.__onError;
    }

    if (processInformation.__onDisconnect) {
      process.off('disconnect', processInformation.__onDisconnect);
      delete processInformation.__onDisconnect;
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

  get _defaultParameter() {
    return {};
  }

  /* c8 ignore next 3 */
  get parameter() {
    return this._processParameter;
  }

  get _defaultOption() {
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

  _selectProcessInformation() {}

  _getProcessInformation(index) {
    return this._processInformation[index];
  }

  _getConnectedProcessInformation() {
    return this._processInformation.filter(({ process }) => process.isConnected);
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


    this._processInformation.forEach(({ process }) => process.writeTo(stream, option));

    this._console = new Console({
      'colorMode': false,
      'ignoreErrors': false,
      'stderr': stream,
      'stdout': stream });


    this._stream = stream;
    this._streamOption = option;

  }

  disconnect() {
    this._getConnectedProcessInformation().forEach(({ process }) => process.disconnect());
  }

  signal(signal) {
    this._getConnectedProcessInformation().forEach(({ process }) => process.signal(signal));
  }

  kill(signal = 'SIGINT') {
    this.signal(signal);
  }}



export { ChildProcessPool };
//# sourceMappingURL=child-process-pool.js.map