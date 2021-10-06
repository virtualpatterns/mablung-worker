import { Is } from '@virtualpatterns/mablung-is'

import { CreateMessageId } from './create-message-id.js'

import { WorkerServerInvalidMessageError } from './error/worker-server-invalid-message-error.js'
import { WorkerServerInvalidPropertyError } from './error/worker-server-invalid-property-error.js'
import { WorkerServerNoIPCChannelError } from './error/worker-server-no-ipc-channel-error.js'

const Process = process

class WorkerServer {

  static INTERVAL = 1000

  static start(worker) {

    if (Is.not.propertyDefined(this, 'worker')) {

      this.worker = worker
      this.attach()
      
      if (Is.function(this.worker.start)) { this.worker.start() }

    }

  }

  static attach() {

    Process.on('interval', this.onIntervalHandler = async () => {

      try {
        await this.onInterval()
      } catch (error) {
        this.clearInterval()
        Process.emit('error', error)
      }

    })

    Process.on('message', this.onMessageHandler = async (message) => {

      try {
        this.clearInterval()
        await this.onMessage(message)
      } catch (error) {
        Process.emit('error', error)
      }

    })

    Process.on('error', this.onErrorHandler = (error) => {

      try {
        this.onError(error)
      } catch (error) {
        console.error(error)
      }

    })

    /* c8 ignore start */
    Process.once('beforeExit', (code) => {

      try {
        this.onExit(code)
      } catch (error) {
        Process.emit('error', error)
      }

    })
    /* c8 ignore stop */

    this.setInterval()

  }

  static setInterval() {

    if (Is.not.propertyDefined(this, 'interval')) {
      this.interval = setInterval(() => { Process.emit('interval') }, this.INTERVAL)
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

        if (message.force) {
          Process.exit(message.code)
        } else {
          this.stop()
          Process.exitCode = message.code
        }

        break

      default:

        message.error = new WorkerServerInvalidMessageError(message)
        delete message.value

        await this.send(message)

    }

  }

  static onError(error) {
    console.error('WorkerServer.onError(error)')
    console.error(error)
  }

  static onExit(code) {
    console.log(`WorkerServer.onExit(${code})`)
  }

  static async send(message) {
    
    let responseMessage = Is.propertyDefined(message, 'id') ? message : { 'id': await CreateMessageId(), ...message }

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

  static stop() {

    if (Is.propertyDefined(this, 'worker')) {

      if (Is.function(this.worker.stop)) { this.worker.stop() }

      this.detach()

      this.worker = null
      delete this.worker

    }

  }

  static detach() {

    this.clearInterval()

    if (this.onErrorHandler) {
      Process.off('error', this.onErrorHandler)
      delete this.onErrorHandler
    }

    if (this.onMessageHandler) {
      Process.off('message', this.onMessageHandler)
      delete this.onMessageHandler
    }

    if (this.onIntervalHandler) {
      Process.off('interval', this.onIntervalHandler)
      delete this.onIntervalHandler
    }

  }

}

export { WorkerServer }