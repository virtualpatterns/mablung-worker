import Test from 'ava';

import { ErrorPool } from './error-pool.js';

Test('new ErrorPool()', async test => {

  let pool = new ErrorPool({ 'numberOfProcess': 1 });
  let error = await new Promise(resolve => {

    let onError = null;

    pool.on('error', onError = (processInformation, error) => {

      pool.off('error', onError);
      onError = null;

      resolve(error);

    });

  });

  test.is(error.code, 'EACCES');

});
//# sourceMappingURL=error-pool.test.js.map