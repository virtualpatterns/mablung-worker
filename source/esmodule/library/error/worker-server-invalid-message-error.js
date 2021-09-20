import { WorkerServerError } from './worker-server-error.js'

class WorkerServerInvalidMessageError extends WorkerServerError {

  constructor(message) {
    super(`The message with type ${message.type ? `'${message.type}'` : message.type} is invalid.`)
  }

}

export { WorkerServerInvalidMessageError }
