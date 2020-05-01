import { WorkerServerError } from './worker-server-error.js'

class WorkerServerUncaughtExceptionError extends WorkerServerError {

  constructor() {
    super(WorkerServerUncaughtExceptionError.name)
  }

}

export { WorkerServerUncaughtExceptionError }