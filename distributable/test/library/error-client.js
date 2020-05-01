import { Configuration } from '@virtualpatterns/mablung-configuration';

import { LoggedClient } from './logged-client.js';

class ErrorClient extends LoggedClient {

  constructor(...parameter) {
    super(...parameter);
  }

  get defaultOption() {
    return Configuration.merge(super.defaultOption, { 'execPath': '/abc' });
  }}



export { ErrorClient };
//# sourceMappingURL=error-client.js.map