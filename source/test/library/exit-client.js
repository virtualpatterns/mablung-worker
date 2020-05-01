import { Configuration } from '@virtualpatterns/mablung-configuration'

import { LoggedClient } from './logged-client.js'

const Require = __require

class ExitClient extends LoggedClient {

  constructor(...parameter) {
    super(...parameter)
  }

  get defaultParameter() {
    return Configuration.merge(super.defaultParameter, { '--worker-server-class-path': Require.resolve('./exit-server.js') })
  }

}

export { ExitClient }
