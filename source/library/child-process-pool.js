import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Console } from 'console'
import EventEmitter from 'events'
import FileSystem from 'fs-extra'
import Is from '@pwn/is'
import OS from 'os'
import Stream from 'stream'

import { ChildProcess } from './child-process.js'
import { Null } from './null.js'

const Process = process

class ChildProcessPool extends EventEmitter {

  constructor(userPath, userParameter = {}, userOption = {}) {
    super()

    let path = userPath
    let parameter = Configuration.getParameter(this._defaultParameter, userParameter)
    let option = Configuration.getOption(this._defaultOption, userOption)

    let numberOfProcess = option.numberOfProcess || OS.cpus().length - 1
    let processInformation = []

    for (let index = 0; index < numberOfProcess; index++) {
      processInformation.push(this._createProcessInformation(index, path, parameter, option))
    }

    this._processPath = path
    this._processParameter = parameter
    this._processOption = option

    this._processInformation = processInformation

    this._console = new Null()

    this._stream = null
    this._streamOption = null
    
    this._processInformation.forEach((processInformation) => this._attachProcessInformation(processInformation))

  }

  _createProcessInformation(index, path, parameter, option) {

    return {
      'index': index,
      'numberOfCreate': 0,
      'process': this._createProcess(index, path, parameter, option)
    }

  }

  _createProcess(index, path, parameter, option) {
    return new ChildProcess(path, parameter, Configuration.merge(option, { 'env': Configuration.merge(Process.env, { 'CHILD_PROCESS_POOL_INDEX': index }) }))
  }

  _recreateProcess(processInformation) {

    let index = processInformation.index

    let processPath = this._processPath
    let processParameter = this._processParameter
    let processOption = this._processOption

    let stream = this._stream
    let streamOption = this._streamOption

    this._detachProcessInformation(processInformation)

    if (processInformation.numberOfCreate < processOption.maximumNumberOfCreate) {

      processInformation.process = this._createProcess(index, processPath, processParameter, processOption)
      processInformation.numberOfCreate++

      this._attachProcessInformation(processInformation)

      if (Is.not.null(stream)) {
        processInformation.process.writeTo(stream, streamOption)
      }

    }

  }

  _attachProcessInformation(processInformation) {
    
    let { index, process } = processInformation

    process.on('error', processInformation.__onError = (error) => {
      this._console.error('ChildProcessPool.on(\'error\', processInformation.__onError = (error) => { ... })')
      this._console.error(error)
  
      try {
        this._onError(index, process, error)
        // do not recreate on error
      /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error)
      }

    })

    process.on('disconnect', processInformation.__onDisconnect = () => {
      this._console.log('ChildProcessPool.on(\'disconnect\', processInformation.__onDisconnect = () => { ... })')
  
      try {
        this._onDisconnect(index, process)
      /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error)
      }

    })

    process.on('exit', processInformation.__onExit = (code) => {
      this._console.log(`ChildProcessPool.on('exit', processInformation.__onExit = (${code}) => { ... })`)

      try {

        this._onExit(index, process, code)

        if (code > 0) {
          this._recreateProcess(processInformation)
        }

      /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error)
      }

    })

    process.on('kill', processInformation.__onKill = (signal) => {
      this._console.log(`ChildProcessPool.on('kill', processInformation.__onKill = ('${signal}') => { ... })`)

      try {
        this._onKill(index, process, signal)
        this._recreateProcess(processInformation)
      /* c8 ignore next 3 */
      } catch (error) {
        this._console.error(error)
      }

    })

  }

  _detachProcessInformation(processInformation) {
    
    let { process } = processInformation

    if (processInformation.__onKill) {
      process.off('kill', processInformation.__onKill)
      delete processInformation.__onKill
    }

    if (processInformation.__onExit) {
      process.off('exit', processInformation.__onExit)
      delete processInformation.__onExit
    }

    if (processInformation.__onDisconnect) {
      process.off('disconnect', processInformation.__onDisconnect)
      delete processInformation.__onDisconnect
    }

    if (processInformation.__onError) {
      process.off('error', processInformation.__onError)
      delete processInformation.__onError
    }

  }

  _onError(index, process, error) {
    this.emit('error', index, process, error)
  }

  _onDisconnect(index, process) {
    this.emit('disconnect', index, process)
  }

  _onExit(index, process, code) {
    this.emit('exit', index, process, code)
  }

  _onKill(index, process, signal) {
    this.emit('kill', index, process, signal)
  }

  get _defaultParameter() {
    return {}
  }

  /* c8 ignore next 3 */
  get parameter() {
    return this._processParameter
  }

  get _defaultOption() {
    return {
      'maximumNumberOfCreate': 3,
      'numberOfProcess': OS.cpus().length - 1
    }
  }

  get option() {
    return this._processOption
  }

  get maximumNumberOfCreate() {
    return this._processOption.maximumNumberOfCreate
  }

  get numberOfProcess() {
    return this._processOption.numberOfProcess
  }

  _selectProcess() {}

  _getProcess(index) {
    return this._processInformation[index].process
  }

  _getConnectedProcess() {
    return this._processInformation
      .filter(({ process }) => process.isConnected)
      .map(({ process }) => process)
  }

  writeTo(path, option = { 'autoClose': true, 'emitClose': true, 'encoding': 'utf8', 'flags': 'a+' }) {
 
    let stream = null

    switch (true) {
      /* c8 ignore next 3 */
      case path instanceof Stream.Writable:
        stream = path
        break
      default:
        stream = FileSystem.createWriteStream(path, option)
    }

    this._processInformation.forEach(({ process }) => process.writeTo(stream, option))

    this._console = new Console({
      'colorMode': false,
      'ignoreErrors': false,
      'stderr': stream,
      'stdout': stream
    })

    this._stream = stream
    this._streamOption = option
        
  }

  disconnect() {
    this._getConnectedProcess().forEach((process) => process.disconnect())
  }

  signal(signal) {
    this._getConnectedProcess().forEach((process) => process.signal(signal))
  }

  kill(signal = 'SIGINT') {
    this.signal(signal)
  }

}

export { ChildProcessPool }