import { createRequire as _createRequire } from "module";import ChildProcess from 'child_process';
import Test from 'ava';

const Require = _createRequire(import.meta.url); // __require is replaced by @virtualpatterns/mablung-babel-plugin-replace

Test('...', (test) => {

  let childProcess = ChildProcess.fork(Require.resolve('./forked.js'), [], { 'execPath': '/abc' });

  childProcess.on('error', (error) => {
    console.error('childProcess.on(\'error\', (error) => { ... })');
    console.error(error);
  });

  childProcess.on('exit', () => {
    console.log('childProcess.on(\'exit\', () => { ... })');
  });

  test.truthy(childProcess.pid);

  return new Promise((resolve /* , reject */) => {
    setTimeout(() => {
      resolve();
      // childProcess.send({ 'type': 'end' }, (error) => {
      //   if (error) {
      //     reject(error)
      //   } else {
      //     resolve()
      //   }
      // })
    }, 2500);

  });

});

//# sourceMappingURL=fork._test.js.map