"use strict";

var _sinon = _interopRequireDefault(require("sinon"));

var _ava = _interopRequireDefault(require("ava"));

var _index = require("../../../index.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Require = require;
(0, _ava.default)('NextWorkerPool._selectProcess(methodName, parameter)', async test => {
  const sandbox = _sinon.default.createSandbox();

  try {
    let pool = new _index.NextWorkerPool(Require.resolve("../worker.cjs"));

    try {
      sandbox.spy(pool, '_selectProcess');
      await pool.module.getPid();
      test.true(pool._selectProcess.calledOnce);
      test.true(pool._selectProcess.calledWith('getPid', []));
    } finally {
      await pool.exit();
    }
  } finally {
    sandbox.restore();
  }
});
//# sourceMappingURL=next-worker-pool.test.cjs.map