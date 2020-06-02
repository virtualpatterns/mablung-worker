import { Configuration } from '@virtualpatterns/mablung-configuration'

import { ErrorClient } from './error-client.js'
// import { LoggedPool } from './logged-pool.js'
import { WorkerPool } from '../../index.js'

const Process = process

class ErrorPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter)
  }

  _createProcess(index, path, parameter, option) {
    return new ErrorClient(path, parameter, Configuration.merge(option, { 'env': Configuration.merge(Process.env, { 'ERROR_POOL_INDEX': index }) }))
  }

}

export { ErrorPool }
