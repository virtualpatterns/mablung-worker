"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorClient = void 0;

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _index = require("../../index.cjs");

// import { LoggedClient } from './logged-client.js'
class ErrorClient extends _index.WorkerClient {
  constructor(...parameter) {
    super(...parameter);
  }

  get _defaultOption() {
    return _mablungConfiguration.Configuration.merge(super._defaultOption, {
      'execPath': __filename
    });
  }

}

exports.ErrorClient = ErrorClient;

//# sourceMappingURL=error-client.cjs.map