import { WorkerServer } from '../../index.js'

import { WorkerExceptionError } from './error/worker-exception-error.js'
import { WorkerUncaughtExceptionError } from './error/worker-uncaught-exception-error.js'
import { WorkerUnhandledRejectionError } from './error/worker-unhandled-rejection-error.js'

const Process = process

class Worker {

  static getPid(duration = 0) {

    if (duration > 0) {

      return new Promise((resolve) => {

        setTimeout(() => {
          /* c8 ignore next 1 */
          resolve(Process.pid)
        }, duration)

      })

    } else {
      return Process.pid
    }

  }

  static throwException() {
    throw new WorkerExceptionError()
  }

  static throwUncaughtException() {
    setImmediate(() => { throw new WorkerUncaughtExceptionError() })
  }

  static rejectUnhandledException() {
    setImmediate(() => Promise.reject(new WorkerUnhandledRejectionError()))
  }

}

(() => {
  return WorkerServer.publish(Worker)
})()
