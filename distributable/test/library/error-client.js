import _URL from "url";import { Configuration } from '@virtualpatterns/mablung-configuration';

import { LoggedClient } from './logged-client.js';
import { WorkerClient } from '../../index.js';

class ErrorClient extends WorkerClient {

  constructor(...parameter) {
    super(...parameter);
  }

  get _defaultOption() {
    return Configuration.merge(super._defaultOption, { 'execPath': _URL.fileURLToPath(import.meta.url) });
  }}



export { ErrorClient };
//# sourceMappingURL=error-client.js.map