"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerClientModuleHandler = void 0;
const EXCLUDE_PROPERTY_NAME = ['then'];

class WorkerClientModuleHandler {
  static get(target, propertyName) {
    if (!EXCLUDE_PROPERTY_NAME.includes(propertyName)) {
      return function (...parameter) {
        return target.apply(propertyName, parameter);
      }.bind(target);
    } else {
      return undefined;
    }
  }

}

exports.WorkerClientModuleHandler = WorkerClientModuleHandler;
//# sourceMappingURL=worker-client-module-handler.cjs.map