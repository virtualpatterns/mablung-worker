"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerPoolParameter = void 0;

var _workerClientParameter = require("./worker-client-parameter.cjs");

class WorkerPoolParameter {
  static getConstructorParameter(...parameter) {
    return _workerClientParameter.WorkerClientParameter.getConstructorParameter(...parameter);
  }

}

exports.WorkerPoolParameter = WorkerPoolParameter;

//# sourceMappingURL=worker-pool-parameter.cjs.map