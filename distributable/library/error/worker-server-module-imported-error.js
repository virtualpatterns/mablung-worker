import Path from 'path';

import { WorkerServerError } from './worker-server-error.js';

class WorkerServerModuleImportedError extends WorkerServerError {

  constructor(url) {
    super(`The server already has an imported module from '${Path.relative('', url)}'.`);
  }}



export { WorkerServerModuleImportedError };
//# sourceMappingURL=worker-server-module-imported-error.js.map