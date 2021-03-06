import { WorkerClientRejectedError } from './worker-client-rejected-error.js'

class WorkerClientDisconnectedError extends WorkerClientRejectedError {

  constructor() {
    super('The server disconnected.')
  }

}

export { WorkerClientDisconnectedError }
