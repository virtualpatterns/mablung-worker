import Path from 'path'

import { WorkerServerError } from './worker-server-error.js'

class WorkerServerModuleExportError extends WorkerServerError {

  constructor(url, methodName) {
    super(`The module imported from '${Path.relative('', url)}' does not export '${methodName}'.`)
  }

}

export { WorkerServerModuleExportError }
