import { Configuration } from '@virtualpatterns/mablung-configuration'
// import { LoggedClient } from './logged-client.js'
import { WorkerClient } from '../../index.js'

const Require = __require

class ExitClient extends WorkerClient {

  constructor(...parameter) {
    super(...parameter)
  }

  get _defaultParameter() {
    return Configuration.merge(super._defaultParameter, { '--worker-server-class-path': Require.resolve('./exit-server.js') })
  }

}

export { ExitClient }
