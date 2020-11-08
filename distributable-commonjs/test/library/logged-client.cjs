"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggedClient = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _index = require("../../index.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LoggedClient extends _index.WorkerClient {
  constructor(...parameter) {
    super(...parameter);
    let path = 'process/log/logged-client.log';

    _fsExtra.default.ensureDirSync(_path.default.dirname(path));

    this.writeTo(path);
  }

}

exports.LoggedClient = LoggedClient;
//# sourceMappingURL=logged-client.cjs.map