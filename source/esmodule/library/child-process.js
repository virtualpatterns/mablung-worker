import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Is } from '@virtualpatterns/mablung-is'

import { ChildProcessDurationExceededError } from './error/child-process-duration-exceeded-error.js'
import { ChildProcessExitedError } from './error/child-process-exited-error.js'
import { ChildProcessKilledError } from './error/child-process-killed-error.js'
import { ChildProcessSignalError } from './error/child-process-signal-error.js'

import { Lock } from './lock.js'

const Process = process

class ChildProcess {

  constructor(userPath, userArgument = {}, userOption = {}) {

    this.processPath = userPath
    this.processArgument = Configuration.getArgument(this.defaultArgument, userArgument)
    this.processOption = Configuration.getOption(this.defaultOption, userOption)

    this.process = this.createProcess(this.processPath, this.processArgument, this.processOption)
    this.isProcessError = true

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

  // derived class must implement ...
  // createProcess(path, argument, option) { }

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

    let [ , name, , ...argument ] = await this.whenEvent([
      { 'emitter': this.process, 'name': 'spawn' },
      { 'emitter': this.process, 'name': 'error' }
    ], maximumDuration)

    switch (name) {
      case 'spawn':
        return
      case 'error':
        throw argument[0]
    }

  }

  /* c8 ignore start */
  async whenMessage(compareFn = () => true, maximumDuration = 0) {

    let totalDuration = 0
    let durationRemaining = maximumDuration
    
    while (durationRemaining >= 0) {

      let [ , name, duration, ...argument ] = await this.whenEvent([
        { 'emitter': this.process, 'name': 'message' },
        { 'emitter': this.process, 'name': 'error' },
        { 'emitter': this.process, 'name': 'exit' }
      ], maximumDuration)

      switch (name) {
        case 'message':
          if (compareFn(argument[0])) { return argument[0] }
          break
        case 'error':
          throw argument[0]
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

      totalDuration += duration
      durationRemaining -= durationRemaining === 0 ? 0 : duration

    }

    throw new ChildProcessDurationExceededError(totalDuration, maximumDuration)

  }
  
  async whenOutput(compareFn = () => true, maximumDuration = 0) {

    let data = ''
    let totalDuration = 0
    let durationRemaining = maximumDuration

    while (durationRemaining >= 0) {

      let [ , name, duration, ...argument ] = await this.whenEvent([
        { 'emitter': this.process.stdout, 'name': 'data' },
        { 'emitter': this.process.stderr, 'name': 'data' },
        { 'emitter': this.process, 'name': 'error' },
        { 'emitter': this.process, 'name': 'exit' }
      ], maximumDuration)

      switch (name) {
        case 'data':
          data = data.concat(argument[0].toString())
          if (compareFn(data)) { return data }
          break
        case 'error':
          throw argument[0]
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

      totalDuration += duration
      durationRemaining -= durationRemaining === 0 ? 0 : duration

    }

    throw new ChildProcessDurationExceededError(totalDuration, maximumDuration)

  }
  /* c8 ignore stop */

  async whenExit(maximumDuration = 0) {

    let [ , name, , ...argument ] = await this.whenEvent([
      { 'emitter': this.process, 'name': 'exit' },
      { 'emitter': this.process, 'name': 'error' }
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
        throw argument[0]
    }

  }

  async whenKill(maximumDuration = 0) {

    let [ , name, , ...argument ] = await this.whenEvent([
      { 'emitter': this.process, 'name': 'exit' },
      { 'emitter': this.process, 'name': 'error' }
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
        throw argument[0]
    }

  }

  async whenError(maximumDuration = 0) {

    let [, , ...argument] = await this.whenEvent([{ 'emitter': this.process, 'name': 'error' } ], maximumDuration)
          
    return argument[0]

  }

  whenEvent(event, maximumDuration = 0) {

    // event is array of { 'emitter': ..., 'name': '...' }

    let lock = new Lock()

    return new Promise((resolve, reject) => {

      let onEventTimeout = null

      let begin = Process.hrtime.bigint()

      for (let eventOn of (Is.array(event) ? event : [ event ])) {

        eventOn.emitter.once(eventOn.name, eventOn.onEventHandler = (...argument) => {

          if (lock.isOpen) {

            let end = Process.hrtime.bigint()
            let duration = parseInt((end - begin) / BigInt(1e6))

            if (maximumDuration > 0) {
              clearTimeout(onEventTimeout)
              onEventTimeout = null
            }

            for (let eventOff of (Is.array(event) ? event.reverse() : [ event ])) {
              eventOff.emitter.off(eventOff.name, eventOff.onEventHandler)
              delete eventOff.onEventHandler
            }

            resolve([ eventOn.emitter, eventOn.name, duration, ...argument ])

          }

        })

      }

      if (maximumDuration > 0) {

        onEventTimeout = setTimeout(() => {

          if (lock.isOpen) {

            let end = Process.hrtime.bigint()
            let duration = parseInt((end - begin) / BigInt(1e6))

            clearTimeout(onEventTimeout)
            onEventTimeout = null

            for (let eventOff of (Is.array(event) ? event.reverse() : [event])) {
              eventOff.emitter.off(eventOff.name, eventOff.onEventHandler)
              delete eventOff.onEventHandler
            }

            reject(new ChildProcessDurationExceededError(duration, maximumDuration))

          }

        }, maximumDuration)

      }

    })

  }

  // static whenEvent(emitter, name, maximumDuration = 0) {

  //   let lock = new Lock()

  //   return new Promise((resolve, reject) => {

  //     let onEventHandler = {}
  //     let onEventTimeout = null

  //     let begin = Process.hrtime.bigint()

  //     for (let nameOn of (Is.array(name) ? name : [ name ])) {

  //       emitter.once(nameOn, onEventHandler[nameOn] = (...argument) => {

  //         if (lock.isOpen) {

  //           let end = Process.hrtime.bigint()
  //           let duration = parseInt((end - begin) / BigInt(1e6))

  //           if (maximumDuration > 0) {
  //             clearTimeout(onEventTimeout)
  //             onEventTimeout = null
  //             delete onEventHandler['timeout']
  //           }

  //           for (let nameOff of (Is.array(name) ? name.reverse() : [ name ])) {
  //             emitter.off(nameOff, onEventHandler[nameOff])
  //             delete onEventHandler[nameOff]
  //           }

  //           resolve([ nameOn, duration, ...argument ])

  //         }

  //       })

  //     }

  //     if (maximumDuration > 0) {

  //       onEventTimeout = setTimeout(onEventHandler['timeout'] = () => {

  //         if (lock.isOpen) {

  //           let end = Process.hrtime.bigint()
  //           let duration = parseInt((end - begin) / BigInt(1e6))

  //           clearTimeout(onEventTimeout)
  //           onEventTimeout = null
  //           delete onEventHandler['timeout']

  //           for (let nameOff of (Is.array(name) ? name.reverse() : [name])) {
  //             emitter.off(nameOff, onEventHandler[nameOff])
  //             delete onEventHandler[nameOff]
  //           }

  //           reject(new ChildProcessDurationExceededError(duration, maximumDuration))

  //         }

  //       }, maximumDuration)

  //     }

  //   })

  // }

}

[
  'pid',
  'stderr',
  'stdout'
].forEach((propertyName) => {
  Object.defineProperty(ChildProcess.prototype, propertyName, {
    'get': function () {
      return this.process[propertyName]
    }
  })
})

export { ChildProcess }