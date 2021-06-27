"use strict";

var _mablungIs = require("@virtualpatterns/mablung-is");

var _ava = _interopRequireDefault(require("ava"));

var _errorPool = require("./error-pool.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava.default)('new ErrorPool()', async test => {
  if (_mablungIs.Is.windows()) {
    test.throws(() => new _errorPool.ErrorPool({
      'numberOfProcess': 1
    }), {
      'code': 'UNKNOWN'
    });
  } else {
    let pool = new _errorPool.ErrorPool({
      'numberOfProcess': 1
    });
    let error = await new Promise(resolve => {
      let onError = null;
      pool.on('error', onError = (index, process, error) => {
        test.log(`pool.on('error', onError = (${index}, process, '${error.code}') => { ... })`);
        pool.off('error', onError);
        onError = null;
        resolve(error);
      });
    });
    test.is(error.code, 'EACCES');
  }
});

//# sourceMappingURL=error-pool.test.cjs.map