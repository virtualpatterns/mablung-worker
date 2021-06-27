"use strict";

var _child_process = _interopRequireDefault(require("child_process"));

var _ava = _interopRequireDefault(require("ava"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Require = require; // __require is replaced by @virtualpatterns/mablung-babel-plugin-replace

(0, _ava.default)('...', test => {
  let childProcess = _child_process.default.fork(Require.resolve("./forked.cjs"), [], {
    'execPath': '/abc'
  });

  childProcess.on('error', error => {
    console.error('childProcess.on(\'error\', (error) => { ... })');
    console.error(error);
  });
  childProcess.on('exit', () => {
    console.log('childProcess.on(\'exit\', () => { ... })');
  });
  test.truthy(childProcess.pid);
  return new Promise((resolve
  /* , reject */
  ) => {
    setTimeout(() => {
      resolve(); // childProcess.send({ 'type': 'end' }, (error) => {
      //   if (error) {
      //     reject(error)
      //   } else {
      //     resolve()
      //   }
      // })
    }, 2500);
  });
});

//# sourceMappingURL=fork._test.cjs.map