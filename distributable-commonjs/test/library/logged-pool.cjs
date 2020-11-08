"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggedPool = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _index = require("../../index.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LoggedPool extends _index.WorkerPool {
  constructor(...parameter) {
    super(...parameter);
    let path = 'process/log/logged-pool.log';

    _fsExtra.default.ensureDirSync(_path.default.dirname(path));

    this.writeTo(path);
  }

}

exports.LoggedPool = LoggedPool;
//# sourceMappingURL=logged-pool.cjs.map