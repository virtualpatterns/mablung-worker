import { ChildProcessPoolError } from './child-process-pool-error.js'

class WorkerPoolError extends ChildProcessPoolError {

  constructor(...parameter) {
    super(...parameter)
  }

}

export { WorkerPoolError }
