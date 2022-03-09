import { Is } from '@virtualpatterns/mablung-is'

import { CreateRandomId } from './create-random-id.js'

import { WorkerServerInvalidMessageError } from './error/worker-server-invalid-message-error.js'
import { WorkerServerInvalidPropertyError } from './error/worker-server-invalid-property-error.js'
import { WorkerServerNoIPCChannelError } from './error/worker-server-no-ipc-channel-error.js'

const Process = process

class WorkerServer {

  static Interval = 1000

  static start(worker) {

    if (Is.not.propertyDefined(this, 'worker')) {

      Process.on('interval', this.onIntervalHandler = async () => {

        try {
          await this.onInterval()
        } catch (error) {
          Process.emit('error', error)
        }

      })

      Process.on('message', this.onMessageHandler = async (message) => {

        try {
          this.clearInterval()
          this.onMessage(message)
        } catch (error) {
          Process.emit('error', error)
        }

      })

      if (Is.not.propertyDefined(this, 'onBeforeExitHandler')) {
        Process.on('beforeExit', this.onBeforeExitHandler = (code) => {

          try {
            this.onBeforeExit(code)
          } catch (error) {
            Process.emit('error', error)
          }

        })
      }

      if (Is.not.propertyDefined(this, 'onExitHandler')) {
        Process.once('exit', this.onExitHandler = (code) => {
          delete this.onExitHandler

          try {
            this.onExit(code)
          } catch (error) {
            Process.emit('error', error)
          }

        })
      }

      if (Is.not.propertyDefined(this, 'onErrorHandler')) {
        Process.on('error', this.onErrorHandler = (error) => {
          this.onError(error)
        })
      }

      this.setInterval()

      this.worker = worker

      if (Is.propertyDefined(this.worker, 'start')) { this.worker.start() }

    }

  }

  static stop() {

    if (Is.propertyDefined(this, 'worker')) {

      if (Is.propertyDefined(this.worker, 'stop')) { this.worker.stop() }

      delete this.worker

      this.clearInterval()

      // Process.off('error', this.onErrorHandler)
      // delete this.onErrorHandler

      // if (this.onExitHandler) {
      //   Process.off('exit', this.onExitHandler)
      //   delete this.onExitHandler
      // }

      // Process.off('beforeExit', this.onBeforeExitHandler)
      // delete this.onBeforeExitHandler

      Process.off('message', this.onMessageHandler)
      delete this.onMessageHandler

      Process.off('interval', this.onIntervalHandler)
      delete this.onIntervalHandler

    }

  }

  static setInterval() {

    if (Is.not.propertyDefined(this, 'interval')) {
      this.interval = setInterval(() => { Process.emit('interval') }, this.Interval)
      Process.emit('interval')
    }

  }

  static clearInterval() {

    if (Is.propertyDefined(this, 'interval')) {
      clearInterval(this.interval)
      delete this.interval
    }

  }

  static onInterval() {
    return this.send({ 'type': 'ready' })
  }

  static async onMessage(message) {
    console.log('WorkerServer.onMessage(message)')
    console.dir(message)

    switch (message.type) {
      case 'ready':
        break
      case 'ping': {

        let cpuUsage = null
        cpuUsage = Process.cpuUsage()
        cpuUsage = (cpuUsage.user + cpuUsage.system) / 2.0

        message.value = { 'cpuUsage': cpuUsage }
        await this.send(message)

        break

      }
      case 'call':

        try {

          if (Is.propertyDefined(this.worker, message.name)) {

            let value = null
            value = this.worker[message.name](...message.argument)
            value = value instanceof Promise ? await value : value

            delete message.error

            if (Is.not.undefined(value)) {
              message.value = value
            } else {
              delete message.value
            }

          } else {
            throw new WorkerServerInvalidPropertyError(message.name)
          }

        } catch (error) {

          message.error = error
          delete message.value

        }

        await this.send(message)

        break

      case 'exit':

        this.stop()

        if (message.force) {
          Process.exit(message.code)
        } else {
          Process.exitCode = message.code
        }

        break

      default:

        message.error = new WorkerServerInvalidMessageError(message)
        delete message.value

        await this.send(message)

    }

  }

  static onBeforeExit(code) {
    console.log(`WorkerServer.onBeforeExit(${code})`)
  }

  static onExit(code) {
    console.log(`WorkerServer.onExit(${code})`)
  }

  static onError(error) {
    console.error('WorkerServer.onError(error)')
    console.error(error)
  }

  static async send(message) {
    
    let responseMessage = Is.propertyDefined(message, 'id') ? message : { 'id': await CreateRandomId(), ...message }

    return new Promise((resolve, reject) => {

      if (Process.send) {

        Process.send(responseMessage, (error) => {

          if (Is.nil(error)) {
            resolve()
          } else {
            reject(error)
          }

        })

      } else {
        reject(new WorkerServerNoIPCChannelError())
      }

    })

  }

}

export { WorkerServer }