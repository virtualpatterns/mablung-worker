import { ChildProcessError } from './child-process-error.js'

class WorkerClientError extends ChildProcessError {

  constructor(...parameter) {
    super(...parameter)
  }

}

export { WorkerClientError }
