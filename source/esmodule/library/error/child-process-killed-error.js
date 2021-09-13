import { ChildProcessError } from './child-process-error.js'

class ChildProcessKilledError extends ChildProcessError {

  constructor(signal) {
    super(`The server was killed by signal ${signal}.`)
  }

}

export { ChildProcessKilledError }
