import { ChildProcessError } from './child-process-error.js'

class ChildProcessDurationExceededError extends ChildProcessError {

  constructor(duration, maximumDuration) {
    super(`The operation duration of ${duration}ms exceeds the maximum duration of ${maximumDuration}ms.`)
  }

}

export { ChildProcessDurationExceededError }
