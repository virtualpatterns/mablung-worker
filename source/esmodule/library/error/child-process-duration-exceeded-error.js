import { ChildProcessError } from './child-process-error.js'

class ChildProcessDurationExceededError extends ChildProcessError {

  constructor(maximumDuration) {
    super(`The operation duration exceeded the maximum duration of ${maximumDuration}ms.`)
  }

}

export { ChildProcessDurationExceededError }
