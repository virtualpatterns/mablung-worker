import { ChildProcessError } from './child-process-error.js'

class ChildProcessInternalError extends ChildProcessError {

  constructor(internalError) {
    super(`The server exited with the internal error '${internalError.message}'.`)
    this.internalError = internalError
  }

}

export { ChildProcessInternalError }
