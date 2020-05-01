import { WorkerClientError } from './worker-client-error.js'

class WorkerClientRejectedError extends WorkerClientError {

  constructor(...parameter) {
    super(...parameter)
  }

}

export { WorkerClientRejectedError }
