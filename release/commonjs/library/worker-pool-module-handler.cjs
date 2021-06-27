"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerPoolModuleHandler = void 0;

var _workerClientModuleHandler = require("./worker-client-module-handler.cjs");

class WorkerPoolModuleHandler {
  static get(target, propertyName) {
    return _workerClientModuleHandler.WorkerClientModuleHandler.get(target, propertyName);
  }

}

exports.WorkerPoolModuleHandler = WorkerPoolModuleHandler;

//# sourceMappingURL=worker-pool-module-handler.cjs.map