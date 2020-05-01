import { WorkerServerError } from './worker-server-error.js'

class WorkerServerNoIPCChannelError extends WorkerServerError {

  constructor() {
    super('The server has no IPC channel.')
  }

}

export { WorkerServerNoIPCChannelError }
