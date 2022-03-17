import { WorkerServer } from '@virtualpatterns/mablung-worker'
import SourceMapSupport from 'source-map-support'

import { WorkerExceptionError } from '../error/worker-exception-error.js'
import { WorkerUncaughtExceptionError } from '../error/worker-uncaught-exception-error.js'
import { WorkerUnhandledRejectionError } from '../error/worker-unhandled-rejection-error.js'

SourceMapSupport.install({ 'handleUncaughtExceptions': false })

const Process = process

class Worker {

  static doIt(duration = 0) {

    if (duration > 0) {

      return new Promise((resolve) => {

        setTimeout(() => {
          resolve()
        }, duration)

      })

    }

  }

  static getPid(duration = 0) {

    if (duration > 0) {

      return new Promise((resolve) => {

        setTimeout(() => {
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

WorkerServer.start(Worker)
