import { WorkerExceptionError } from './error/worker-exception-error.js'
import { WorkerUncaughtExceptionError } from './error/worker-uncaught-exception-error.js'
import { WorkerUnhandledRejectionError } from './error/worker-unhandled-rejection-error.js'

const Process = process

export function getPid(duration = 0) {

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

export function throwException(duration = 0) {

  if (duration > 0) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        /* c8 ignore next 1 */
        reject(new WorkerExceptionError())
      }, duration)

    })

  } else {
    throw new WorkerExceptionError()
  }

}

export function throwUncaughtException() {
  setImmediate(() => { throw new WorkerUncaughtExceptionError() })
}

export function rejectUnhandledException() {
  setImmediate(() => Promise.reject(new WorkerUnhandledRejectionError()))
}

export function onEnd(code = 0, option = {}) {
  console.log(`Worker.onEnd(${code}, option) { ... }`)
  console.dir(option)
}
