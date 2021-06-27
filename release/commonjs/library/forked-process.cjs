"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForkedProcess = void 0;

var _child_process = _interopRequireDefault(require("child_process"));

var _childProcess = require("./child-process.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ForkedProcess extends _childProcess.ChildProcess {
  constructor(path, parameter = {}, option = {}) {
    super(path, parameter, option);
  }

  _createProcess(path, parameter, option) {
    return _child_process.default.fork(path, parameter, option);
  }

}

exports.ForkedProcess = ForkedProcess;

//# sourceMappingURL=forked-process.cjs.map