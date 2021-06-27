"use strict";

var _ava = _interopRequireDefault(require("ava"));

var _exitPool = require("./exit-pool.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava.default)('new ExitPool()', async test => {
  let pool = new _exitPool.ExitPool({
    'numberOfProcess': 1
  });
  let code = await new Promise(resolve => {
    let onExit = null;
    pool.on('exit', onExit = (index, process, code) => {
      test.log(`pool.on('exit', onExit = (${index}, process, ${code}) => { ... })`);
      pool.off('exit', onExit);
      onExit = null;
      resolve(code);
    });
  });
  test.is(code, 0);
});

//# sourceMappingURL=exit-pool.test.cjs.map