import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Is } from '@virtualpatterns/mablung-is'

import { ChildProcessDurationExceededError } from './error/child-process-duration-exceeded-error.js'
import { ChildProcessExitedError } from './error/child-process-exited-error.js'
import { ChildProcessKilledError } from './error/child-process-killed-error.js'
import { ChildProcessSignalError } from './error/child-process-signal-error.js'

const Process = process

class ChildProcess {

  constructor(userPath, userArgument = {}, userOption = {}) {

    this.processPath = userPath
    this.processArgument = Configuration.getArgument(this.defaultArgument, userArgument)
    this.processOption = Configuration.getOption(this.defaultOption, userOption)

    this.process = this.createProcess(this.processPath, this.processArgument, this.processOption)
    this.isProcessError = true

    this.process.once('spawn', () => {
      this.isProcessError = false

      try {
        this.onSpawn()
      } catch (error) {
        this.process.emit('error', error)
      }

    })

    this.process.on('message', (message) => {

      try {
        this.onMessage(message)
      } catch (error) {
        this.process.emit('error', error)
      }

    })

    this.process.once('exit', (code, signal) => {

      try {

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

    this.process.on('error', (error) => {
      this.onError(error, this.isProcessError)
    })

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

  onSpawn(/* path, argument, option */) {}

  onMessage(/* message */) {}

  onExit(/* code */) {}

  onKill(/* signal */) {}

  onError(/* error, isProcessError */) {}

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
        throw argument[0]
    }

  }

  /* c8 ignore start */
  async whenMessage(maximumDuration = 0, compareFn = () => true) {

    let totalDuration = 0
    let durationRemaining = maximumDuration
    
    while (durationRemaining >= 0) {

      let [ name, duration, ...argument ] = await this.whenEvent([
        'message',
        'error',
        'exit'
      ], maximumDuration)

      switch (name) {
        case 'message':
          if (compareFn(argument[0])) {
            return argument[0]
          }
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
        throw argument[0]
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
        throw argument[0]
    }

  }

  async whenError(maximumDuration = 0) {

    let [ , , ...argument ] = await this.whenEvent([ 'error' ], maximumDuration)
          
    return argument[0]

  }

  whenEvent(name, maximumDuration = 0) {
    return ChildProcess.whenEvent(this.process, name, maximumDuration)
  }

  static whenEvent(emitter, name, maximumDuration = 0) {

    let isNotResolved = true

    return new Promise((resolve, reject) => {

      let onEventHandler = {}
      let onEventTimeout = null

      let begin = Process.hrtime.bigint()

      for (let nameOn of (Is.array(name) ? name : [ name ])) {

        // console.log(`> emitter.once('${nameOn}', onEventHandler[('${nameOn}'] = (...argument) => { ... })`)
        emitter.once(nameOn, onEventHandler[nameOn] = (...argument) => {
          // console.log(`- emitter.once('${nameOn}', onEventHandler[('${nameOn}'] = (...argument) => { ... })`)

          if (isNotResolved) {

            let end = Process.hrtime.bigint()
            let duration = parseInt((end - begin) / BigInt(1e6))

            if (maximumDuration > 0) {
              clearTimeout(onEventTimeout)
              onEventTimeout = null
              delete onEventHandler['timeout']
            }

            for (let nameOff of (Is.array(name) ? name.reverse() : [ name ])) {
              // console.log(`> emitter.off('${nameOff}', onEventHandler[('${nameOff}'])`)
              emitter.off(nameOff, onEventHandler[nameOff])
              delete onEventHandler[nameOff]
            }

            resolve([nameOn, duration, ...argument])

            isNotResolved = false

          }

        })

      }

      if (maximumDuration > 0) {

        onEventTimeout = setTimeout(onEventHandler['timeout'] = () => {
          // console.log('- setTimeout(onEventHandler[\'timeout\'] = () => { ... })')

          if (isNotResolved) {

            let end = Process.hrtime.bigint()
            let duration = parseInt((end - begin) / BigInt(1e6))

            clearTimeout(onEventTimeout)
            onEventTimeout = null
            delete onEventHandler['timeout']

            for (let nameOff of (Is.array(name) ? name.reverse() : [name])) {
              // console.log(`> emitter.off('${nameOff}', onEventHandler[('${nameOff}'])`)
              emitter.off(nameOff, onEventHandler[nameOff])
              delete onEventHandler[nameOff]
            }

            reject(new ChildProcessDurationExceededError(duration, maximumDuration))

            isNotResolved = false

          }

        }, maximumDuration)

      }

    })

  }

}

export { ChildProcess }