"use strict";

var _mablungIs = require("@virtualpatterns/mablung-is");

var _ava = _interopRequireDefault(require("ava"));

var _errorClient = require("./error-client.cjs");

var _index = require("../../index.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava.default)('new ErrorClient()', async test => {
  if (_mablungIs.Is.windows()) {
    test.throws(() => new _errorClient.ErrorClient(), {
      'code': 'UNKNOWN'
    });
  } else {
    let worker = new _errorClient.ErrorClient();
    let error = await worker.whenRejected(_index.WorkerClientInternalError);
    test.is(error.internalError.code, 'EACCES');
  }
});

//# sourceMappingURL=error-client.test.cjs.map