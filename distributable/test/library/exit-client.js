import { createRequire as _createRequire } from "module";import { Configuration } from '@virtualpatterns/mablung-configuration';

// import { LoggedClient } from './logged-client.js'
import { WorkerClient } from '../../index.js';

const Require = _createRequire(import.meta.url);

class ExitClient extends WorkerClient {

  constructor(...parameter) {
    super(...parameter);
  }

  get defaultParameter() {
    return Configuration.merge(super.defaultParameter, { '--worker-server-class-path': Require.resolve('./exit-server.js') });
  }}



export { ExitClient };
//# sourceMappingURL=exit-client.js.map