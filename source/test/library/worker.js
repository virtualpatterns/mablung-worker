import { WorkerUncaughtExceptionError } from './error/worker-uncaught-exception-error.js'
import { WorkerUnhandledRejectionError } from './error/worker-unhandled-rejection-error.js'

const Process = process

export function onImport(option = {}) {
  console.log('Worker.onImport(option) { ... }')
  console.dir(option)
  return Process.pid
}

export function getPid(duration = 0) {

  if (duration) {

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

export function throwUncaughtException() {
  setImmediate(() => { throw new WorkerUncaughtExceptionError() })
}
export function rejectUnhandledException() {
  setImmediate(() => Promise.reject(new WorkerUnhandledRejectionError()))
}

export function onRelease(option = {}) {
  console.log('Worker.onRelease(option) { ... }')
  console.dir(option)
  return Process.pid
}

export function onEnd(option = {}) {
  console.log('Worker.onEnd(option) { ... }')
  console.dir(option)
  return Process.pid
}
