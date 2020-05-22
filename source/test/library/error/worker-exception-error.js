import { WorkerError } from './worker-error.js'

class WorkerExceptionError extends WorkerError {

  constructor() {
    super(WorkerExceptionError.name)
  }

}

export { WorkerExceptionError }
