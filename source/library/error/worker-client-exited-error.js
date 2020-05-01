import { WorkerClientRejectedError } from './worker-client-rejected-error.js'

class WorkerClientExitedError extends WorkerClientRejectedError {

  constructor(code) {
    super(`The server exited with code ${code}.`)
  }

}

export { WorkerClientExitedError }
