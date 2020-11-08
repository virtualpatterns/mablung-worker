import FileSystem from 'fs-extra';
import Path from 'path';

import { WorkerPool } from '../../index.js';

class LoggedPool extends WorkerPool {

  constructor(...parameter) {
    super(...parameter);

    let path = 'process/log/logged-pool.log';
    FileSystem.ensureDirSync(Path.dirname(path));

    this.writeTo(path);

  }}



export { LoggedPool };
//# sourceMappingURL=logged-pool.js.map