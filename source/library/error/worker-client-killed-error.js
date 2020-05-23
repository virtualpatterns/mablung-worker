import { WorkerClientRejectedError } from './worker-client-rejected-error.js'

class WorkerClientKilledError extends WorkerClientRejectedError {

  constructor(signal) {
    super(`The server was killed by signal ${signal}.`)
  }

}

export { WorkerClientKilledError }
