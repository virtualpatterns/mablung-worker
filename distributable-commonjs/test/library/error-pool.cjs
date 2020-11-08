"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorPool = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _errorClient = require("./error-client.cjs");

var _index = require("../../index.cjs");

// import { LoggedPool } from './logged-pool.js'
const Process = process;

class ErrorPool extends _index.WorkerPool {
  constructor(...parameter) {
    super(...parameter);
  }

  _createProcess(index, path, parameter, option) {
    return new _errorClient.ErrorClient(path, parameter, _mablungConfiguration.Configuration.merge(option, {
      'env': _mablungConfiguration.Configuration.merge(Process.env, {
        'ERROR_POOL_INDEX': index
      })
    }));
  }

}

exports.ErrorPool = ErrorPool;
//# sourceMappingURL=error-pool.cjs.map