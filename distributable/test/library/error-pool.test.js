import Test from 'ava';

import { ErrorPool } from './error-pool.js';

Test('new ErrorPool()', async test => {

  let pool = new ErrorPool({ 'numberOfProcess': 2 });
  let error = await new Promise(resolve => {
    pool.once('error', (processInformation, error) => {
      resolve(error);
    });
  });

  test.is(error.code, 'ENOENT');

});
//# sourceMappingURL=error-pool.test.js.map