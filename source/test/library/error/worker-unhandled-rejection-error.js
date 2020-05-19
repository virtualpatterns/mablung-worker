import { WorkerError } from './worker-error.js'

class WorkerUnhandledRejectionError extends WorkerError {

  constructor() {
    super(WorkerUnhandledRejectionError.name)
  }

}

export { WorkerUnhandledRejectionError }
