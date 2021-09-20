import { WorkerServerError } from './worker-server-error.js'

class WorkerServerInvalidPropertyError extends WorkerServerError {

  constructor(name) {
    super(`The property ${name ? `'${name}'` : name} is invalid.`)
  }

}

export { WorkerServerInvalidPropertyError }
