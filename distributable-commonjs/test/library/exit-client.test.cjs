"use strict";

var _ava = _interopRequireDefault(require("ava"));

var _exitClient = require("./exit-client.cjs");

var _index = require("../../index.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava.default)('new ExitClient()', async test => {
  await test.notThrowsAsync(new _exitClient.ExitClient().whenRejected(_index.WorkerClientExitedError));
});
//# sourceMappingURL=exit-client.test.cjs.map