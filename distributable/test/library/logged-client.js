
import { WorkerClient } from '../../index.js';

class LoggedClient extends WorkerClient {

  constructor(...parameter) {
    super(...parameter);
    this.writeTo('process/log/logged-client.log');
  }}



export { LoggedClient };
//# sourceMappingURL=logged-client.js.map