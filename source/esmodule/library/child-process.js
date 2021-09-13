import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Is } from '@virtualpatterns/mablung-is'

import { ChildProcessDurationExceededError } from './error/child-process-duration-exceeded-error.js'
import { ChildProcessExitedError } from './error/child-process-exited-error.js'
import { ChildProcessInternalError } from './error/child-process-internal-error.js'
import { ChildProcessKilledError } from './error/child-process-killed-error.js'
import { ChildProcessSignalError } from './error/child-process-signal-error.js'

const Process = process

class ChildProcess {

  constructor(userPath, userArgument = {}, userOption = {}) {

    let processPath = userPath
    let processArgument = Configuration.getArgument(this.defaultArgument, userArgument)
    let processOption = Configuration.getOption(this.defaultOption, userOption)

    let process = this.createProcess(processPath, processArgument, processOption)

    this.processPath = processPath
    this.processArgument = processArgument
    this.processOption = processOption

    this.process = process
    
    this.attachAllHandler()

  }

  get defaultArgument() {
    return {}
  }

  /* c8 ignore next 3 */
  get argument() {
    return this.processArgument
  }

  get defaultOption() {
    return {
      'serialization': 'advanced',
      'stdio': 'pipe'
    }
  }

  get option() {
    return this.processOption
  }

  get pid() {
    return this.process.pid
  }

  get stdout() {
    return this.process.stdout
  }

  get stderr() {
    return this.process.stderr
  }

  // createProcess(path, argument, option) { }

  attachAllHandler() {

    // this.process.on('spawn', this.onExecuteHandler = () => {
    //   console.log('this.process.on(\'spawn\', this.onExecuteHandler = () => { ... })')

    //   try {
    //     this.onExecute(this.processPath, this.processArgument, this.processOption)
    //   /* c8 ignore next 3 */
    //   } catch (error) {
    //     this.onError(error)
    //   }

    // })

    this.process.on('message', this.onMessageHandler = (message) => {

      try {
        this.onMessage(message)
      /* c8 ignore next 3 */
      } catch (error) {
        this.onError(error)
      }

    })

    this.process.on('exit', this.onExitHandler = (code, signal) => {

      try {

        this.detachAllHandler()

        switch (true) {
          case Is.not.null(code):
            this.onExit(code)
            break
          case Is.not.null(signal):
            this.onKill(signal)
            break
          default:
            this.onExit(0)
        }

      /* c8 ignore next 3 */
      } catch (error) {
        this.onError(error)
      }

    })

    this.process.on('error', this.onErrorHandler = (error) => {

      try {
        this.onError(error)
      /* c8 ignore next 3 */
      } catch (error) {
        console.error(error)
      }

    })

  }

  detachAllHandler() {

    if (this.onErrorHandler) {
      this.process.off('error', this.onErrorHandler)
      delete this.onErrorHandler
    }

    if (this.onExitHandler) {
      this.process.off('exit', this.onExitHandler)
      delete this.onExitHandler
    }

    if (this.onMessageHandler) {
      this.process.off('warning', this.onMessageHandler)
      delete this.onMessageHandler
    }

    // if (this.onExecuteHandler) {
    //   this.process.off('spawn', this.onExecuteHandler)
    //   delete this.onExecuteHandler
    // }

  }

  // onExecute(/* path, argument, option */) {}

  onMessage(/* message */) {}

  onExit(/* code */) {}

  onKill(/* signal */) {}

  onError(/* error */) { }
  
  send(message) {

    return new Promise((resolve, reject) => {

      if (Is.string(message)) {

        switch (this.process.kill(message)) {
          /* c8 ignore next 3 */
          case false:
            reject(new ChildProcessSignalError(message, this.process.pid))
            break
          default:
            resolve()
        }

      } else {

        this.process.send(message, (error) => {

          /* c8 ignore next 2 */
          if (Is.not.null(error)) {
            reject(error)
          } else {
            resolve()
          }

        })

      }

    })

  }

  /* c8 ignore start */ 
  async whenMessage(maximumDuration = 0, compareFn = () => true) {

    while (maximumDuration >= 0) {

      let [ name, duration, ...argument ] = await this.whenEvent([
        'message',
        'exit',
        'error'
      ], maximumDuration)

      switch (name) {
        case 'message':
          if (compareFn(argument[0])) {
            return argument[0]
          }
          break
        case 'exit':

          switch (true) {
            case Is.not.null(argument[0]): // code
              throw new ChildProcessExitedError(argument[0])
            case Is.not.null(argument[1]): // signal
              throw new ChildProcessKilledError(argument[1])
            default:
              throw new ChildProcessExitedError(0)
          }

        case 'error':
          throw new ChildProcessInternalError(argument[0])
      }

      maximumDuration -= maximumDuration === 0 ? 0 : duration

    }

    throw new ChildProcessDurationExceededError(maximumDuration)

  }
  /* c8 ignore stop */

  async whenExit(maximumDuration = 0) {

    let [ name,, ...argument ] = await this.whenEvent([
      'exit',
      'error'
    ], maximumDuration)

    switch (name) {
      case 'exit':

        switch (true) {
          case Is.not.null(argument[0]): // code
            return argument[0]
          case Is.not.null(argument[1]): // signal
            throw new ChildProcessKilledError(argument[1])
          default:
            return 0
        }
      
      case 'error':
        throw new ChildProcessInternalError(argument[0])
    }

  }

  async whenKill(maximumDuration = 0) {

    let [ name,, ...argument ] = await this.whenEvent([
      'exit',
      'error'
    ], maximumDuration)

    switch (name) {
      case 'exit':

        switch (true) {
          case Is.not.null(argument[0]): // code
            throw new ChildProcessExitedError(argument[0])
          case Is.not.null(argument[1]): // signal
            return argument[1]
          default:
            throw new ChildProcessExitedError(0)
        }

      case 'error':
        throw new ChildProcessInternalError(argument[0])
    }

  }

  async whenError(maximumDuration = 0) {

    let [ name,, ...argument ] = await this.whenEvent([
      'error',
      'exit'
    ], maximumDuration)

    switch (name) {
      case 'error':
        return argument[0]
      case 'exit':

        switch (true) {
          case Is.not.null(argument[0]): // code
            throw new ChildProcessExitedError(argument[0])
          case Is.not.null(argument[1]): // signal
            throw new ChildProcessKilledError(argument[1])
          default:
            throw new ChildProcessExitedError(0)
        }

    }

  }

  whenEvent(name, maximumDuration = 0) {

    return new Promise((resolve, reject) => {

      let onEventHandler = {}
      let onTimeoutHandler = null

      let begin = Process.hrtime.bigint()

      for (let nameOn of (Is.array(name) ? name : [ name ])) {

        this.process.on(nameOn, onEventHandler[nameOn] = (...argument) => {
          
          let end = Process.hrtime.bigint()
          let duration = parseInt((end - begin) / BigInt(1e6))

          if (maximumDuration > 0) {
            clearTimeout(onTimeoutHandler)
            onTimeoutHandler = null
          }

          for (let nameOff of (Is.array(name) ? name.reverse() : [ name ])) {
            this.process.off(nameOff, onEventHandler[nameOff])
            delete onEventHandler[nameOff]
          }

          resolve([ nameOn, duration, ...argument ])

        })

      }

      if (maximumDuration > 0) {

        onTimeoutHandler = setTimeout(() => {

          clearTimeout(onTimeoutHandler)
          onTimeoutHandler = null

          for (let nameOff of (Is.array(name) ? name.reverse() : [ name ])) {
            this.process.off(nameOff, onEventHandler[nameOff])
            delete onEventHandler[nameOff]
          }

          reject(new ChildProcessDurationExceededError(maximumDuration))

        }, maximumDuration)

      }

    })

  }

}

export { ChildProcess }