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

    this.processPath = userPath
    this.processArgument = Configuration.getArgument(this.defaultArgument, userArgument)
    this.processOption = Configuration.getOption(this.defaultOption, userOption)

    this.process = this.createProcess(this.processPath, this.processArgument, this.processOption)

    this.attach()

  }

  get defaultArgument() {
    return {}
  }

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

  // derived class must implement ...
  // createProcess(path, argument, option) { }

  attach() {

    this.process.on('spawn', this.onSpawnHandler = () => {

      try {
        this.onSpawn()
      } catch (error) {
        this.process.emit('error', error)
      }

    })

    this.process.on('message', this.onMessageHandler = (message) => {

      try {
        this.onMessage(message)
      } catch (error) {
        this.process.emit('error', error)
      }

    })

    this.process.on('error', this.onErrorHandler = (error) => {

      try {
        this.onError(error)
      } catch (error) {
        console.error(error)
      }

    })

    this.process.on('exit', this.onExitHandler = (code, signal) => {

      try {

        this.detach()

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

      } catch (error) {
        this.process.emit('error', error)
      }

    })

  }

  onSpawn(/* path, argument, option */) {}

  onMessage(/* message */) {}

  onError(/* error */) {}

  onExit(/* code */) { }

  onKill(/* signal */) { }

  send(message) {

    return new Promise((resolve, reject) => {

      if (Is.string(message)) {

        if (this.process.kill(message)) {
          resolve()
        } else {
          reject(new ChildProcessSignalError(message, this.process.pid))
        }

      } else {

        this.process.send(message, (error) => {

          if (Is.nil(error)) {
            resolve()
          } else {
            reject(error)
          }

        })

      }

    })

  }

  async whenSpawn(maximumDuration = 0) {

    let [ name, , ...argument ] = await this.whenEvent([
      'spawn',
      'error'
    ], maximumDuration)

    switch (name) {
      case 'spawn':
        return
      case 'error':
        throw new ChildProcessInternalError(argument[0])
    }

  }

  /* c8 ignore start */
  async whenMessage(maximumDuration = 0, compareFn = () => true) {

    let totalDuration = 0
    let durationRemaining = maximumDuration
    
    while (durationRemaining >= 0) {

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

      totalDuration += duration
      durationRemaining -= durationRemaining === 0 ? 0 : duration

    }

    throw new ChildProcessDurationExceededError(totalDuration, maximumDuration)

  }
  /* c8 ignore stop */

  async whenError(maximumDuration = 0) {
    // console.log(`ChildProcess.whenError(${maximumDuration}) { ... }`)

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

  async whenExit(maximumDuration = 0) {

    let [name, , ...argument] = await this.whenEvent([
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

    let [name, , ...argument] = await this.whenEvent([
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

  whenEvent(name, maximumDuration = 0) {
    // console.log(`ChildProcess.whenEvent(name, ${maximumDuration}) { ... }`)
    // console.dir(name)

    return new Promise((resolve, reject) => {

      let onEventHandler = {}
      let onEventTimeout = null

      let begin = Process.hrtime.bigint()

      for (let nameOn of (Is.array(name) ? name : [ name ])) {

        // console.log(`> this.process.on('${nameOn}', onEventHandler['${nameOn}'] = (...argument) => { ... })`)
        this.process.on(nameOn, onEventHandler[nameOn] = (...argument) => {
          // console.log(`< this.process.on('${nameOn}', onEventHandler['${nameOn}'] = (...argument) => { ... })`)
          // console.dir(argument)

          let end = Process.hrtime.bigint()
          let duration = parseInt((end - begin) / BigInt(1e6))

          if (maximumDuration > 0) {
            clearTimeout(onEventTimeout)
            onEventTimeout = null
            delete onEventHandler['timeout']
          }

          for (let nameOff of (Is.array(name) ? name.reverse() : [name])) {
            // console.log(`this.process.off('${nameOff}', onEventHandler['${nameOff}'])`)
            this.process.off(nameOff, onEventHandler[nameOff])
            delete onEventHandler[nameOff]
          }

          resolve([ nameOn, duration, ...argument ])

        })

      }

      if (maximumDuration > 0) {

        onEventTimeout = setTimeout(onEventHandler['timeout'] = () => {

          let end = Process.hrtime.bigint()
          let duration = parseInt((end - begin) / BigInt(1e6))

          clearTimeout(onEventTimeout)
          onEventTimeout = null
          delete onEventHandler['timeout']

          for (let nameOff of (Is.array(name) ? name.reverse() : [ name ])) {
            // console.log(`this.process.off('${nameOff}', onEventHandler['${nameOff}'])`)
            this.process.off(nameOff, onEventHandler[nameOff])
            delete onEventHandler[nameOff]
          }

          reject(new ChildProcessDurationExceededError(duration, maximumDuration))

        }, maximumDuration)

      }

    })

  }

  detach() {

    if (this.onExitHandler) {
      this.process.off('exit', this.onExitHandler)
      delete this.onExitHandler
    }

    if (this.onErrorHandler) {
      this.process.off('error', this.onErrorHandler)
      delete this.onErrorHandler
    }

    if (this.onMessageHandler) {
      this.process.off('message', this.onMessageHandler)
      delete this.onMessageHandler
    }

    if (this.onSpawnHandler) {
      this.process.off('spawn', this.onSpawnHandler)
      delete this.onSpawnHandler
    }

  }

}

export { ChildProcess }