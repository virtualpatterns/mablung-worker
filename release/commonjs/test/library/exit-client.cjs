"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExitClient = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _index = require("../../index.cjs");

// import { LoggedClient } from './logged-client.js'
const Require = require;

class ExitClient extends _index.WorkerClient {
  constructor(...parameter) {
    super(...parameter);
  }

  get _defaultParameter() {
    return _mablungConfiguration.Configuration.merge(super._defaultParameter, {
      '--worker-server-class-path': Require.resolve("./exit-server.cjs")
    });
  }

}

exports.ExitClient = ExitClient;

//# sourceMappingURL=exit-client.cjs.map