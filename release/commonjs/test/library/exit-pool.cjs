"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExitPool = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _exitClient = require("./exit-client.cjs");

var _index = require("../../index.cjs");

// import { LoggedPool } from './logged-pool.js'
const Process = process;

class ExitPool extends _index.WorkerPool {
  constructor(...parameter) {
    super(...parameter);
  }

  _createProcess(index, path, parameter, option) {
    return new _exitClient.ExitClient(path, parameter, _mablungConfiguration.Configuration.merge(option, {
      'env': _mablungConfiguration.Configuration.merge(Process.env, {
        'EXIT_POOL_INDEX': index
      })
    }));
  }

}

exports.ExitPool = ExitPool;

//# sourceMappingURL=exit-pool.cjs.map