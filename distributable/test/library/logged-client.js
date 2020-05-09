import FileSystem from 'fs-extra';
import Path from 'path';

import { WorkerClient } from '../../index.js';

class LoggedClient extends WorkerClient {

  constructor(...parameter) {
    super(...parameter);

    let path = 'process/log/logged-client.log';
    FileSystem.ensureDirSync(Path.dirname(path));

    this.writeTo(path);

  }}



export { LoggedClient };
//# sourceMappingURL=logged-client.js.map