import { WorkerClientModuleHandler } from './worker-client-module-handler.js';

class WorkerPoolModuleHandler {

  static get(target, propertyName) {
    return WorkerClientModuleHandler.get(target, propertyName);
  }}



export { WorkerPoolModuleHandler };
//# sourceMappingURL=worker-pool-module-handler.js.map