import Test from 'ava';

import { ExitPool } from './exit-pool.js';

Test('new ExitPool()', async test => {

  let pool = new ExitPool({ 'numberOfProcess': 1 });
  let code = await new Promise(resolve => {

    let onExit = null;

    pool.on('exit', onExit = (processInformation, code) => {

      pool.off('exit', onExit);
      onExit = null;

      resolve(code);

    });

  });

  test.is(code, 0);

});
//# sourceMappingURL=exit-pool.test.js.map