import { Is } from '@virtualpatterns/mablung-is'

import { WorkerServerInvalidMessageError } from './error/worker-server-invalid-message.js'
import { WorkerServerNoIPCChannelError } from './error/worker-server-no-ipc-channel-error.js'

const Process = process

class WorkerServer {

  static READY_INTERVAL = 1000

  static publish(worker) {

    Object.defineProperty(this, 'worker', {
      'configurable': true,
      'enumerable': true,
      'get': () => worker
    })

    return this.attachAllHandler()

  }

  static async attachAllHandler() {

    /* c8 ignore start */
    this.onReadyHandler = setInterval(async () => {

      try {
        await this.onReady()
      } catch (error) {
        this.detachReadyHandler()
        this.onError(error)
      }

    }, this.READY_INTERVAL)
    /* c8 ignore end */

    Process.on('message', this.onMessageHandler = async (message) => {

      try {
        this.detachReadyHandler()
        await this.onMessage(message)
      /* c8 ignore next 3 */
      } catch (error) {
        this.onError(error)
      }

    })

    Process.on('exit', this.onExitHandler = (code) => {

      try {
        this.detachAllHandler()
        this.onExit(code)
      /* c8 ignore next 3 */
      } catch (error) {
        this.onError(error)
      }

    })

    Process.on('uncaughtException', this.onUncaughtExceptionHandler = (error) => {
      this.onError(error)
    })

    Process.on('unhandledRejection', this.onUnhandledRejectionHandler = (error) => {
      this.onError(error)
    })

    await this.onReady()

  }

  static detachAllHandler() {

    if (this.onUnhandledRejectionHandler) {
      Process.off('unhandledRejection', this.onUnhandledRejectionHandler)
      delete this.onUnhandledRejectionHandler
    }

    if (this.onUncaughtExceptionHandler) {
      Process.off('uncaughtException', this.onUncaughtExceptionHandler)
      delete this.onUncaughtExceptionHandler
    }

    if (this.onExitHandler) {
      Process.off('exit', this.onExitHandler)
      delete this.onExitHandler
    }

    if (this.onMessageHandler) {
      Process.off('message', this.onMessageHandler)
      delete this.onMessageHandler
    }

    this.detachReadyHandler()

  }

  static detachReadyHandler() {

    if (this.onReadyHandler) {
      clearInterval(this.onReadyHandler)
      delete this.onReadyHandler
    }

  }

  static async onReady() {
    console.log('WorkerServer.onReady()')
    
    // letting client know we're ready
    await this.send({ 'type': 'ready' })

  }

  static async onMessage(message) {
    console.log('WorkerServer.onMessage(message)')
    console.dir(message)

    switch (message.type) {
      case 'ready':
        // client lets us know it's ready,

        message.returnValue = undefined
        await this.send(message)

        break
      
      case 'ping': {

        let cpuUsage = null
        cpuUsage = Process.cpuUsage()
        cpuUsage = (cpuUsage.user + cpuUsage.system) / 2.0

        message.returnValue = { 'cpuUsage': cpuUsage }
        await this.send(message)

        break

      }
      case 'call':

        try {

          let returnValue = null
          returnValue = this.worker[message.methodName](...message.argument)
          returnValue = returnValue instanceof Promise ? await returnValue : returnValue

          delete message.error
          message.returnValue = returnValue

        } catch (error) {

          message.error = error
          delete message.returnValue

        }

        await this.send(message)

        break

      case 'exit':

        Process.exit(message.code)

        break

      default:

        message.error = new WorkerServerInvalidMessageError(message)
        delete message.returnValue

        await this.send(message)

    }

  }

  static onExit(code) {
    console.log(`WorkerServer.onExit(${code})`)
  }

  static onError(error) {
    console.error('WorkerServer.onError(error)')
    console.error(error)
  }

  static send(message) {
    console.log('WorkerServer.send(message)')
    console.dir(message)

    return new Promise((resolve, reject) => {

      if (Process.send) {

        Process.send(message, (error) => {

          /* c8 ignore next 3 */
          if (Is.not.null(error)) {
            reject(error)
          } else {
            resolve()
          }

        })

      /* c8 ignore next 3 */
      } else {
        reject(new WorkerServerNoIPCChannelError())
      }

    })

  }

}

export { WorkerServer }