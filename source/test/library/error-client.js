import { Configuration } from '@virtualpatterns/mablung-configuration'

// import { LoggedClient } from './logged-client.js'
import { WorkerClient } from '../../index.js'

class ErrorClient extends WorkerClient {

  constructor(...parameter) {
    super(...parameter)
  }

  get _defaultOption() {
    return Configuration.merge(super._defaultOption, { 'execPath': '/abc' })
  }

}

export { ErrorClient }
