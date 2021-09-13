import { ChildProcessError } from './child-process-error.js'

class ChildProcessExitedError extends ChildProcessError {

  constructor(code) {
    super(`The server exited with code ${code}.`)
  }

}

export { ChildProcessExitedError }
