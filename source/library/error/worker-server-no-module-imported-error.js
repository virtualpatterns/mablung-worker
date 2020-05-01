import { WorkerServerError } from './worker-server-error.js'

class WorkerServerNoModuleImportedError extends WorkerServerError {

  constructor() {
    super('The server has no imported module.')
  }

}

export { WorkerServerNoModuleImportedError }
