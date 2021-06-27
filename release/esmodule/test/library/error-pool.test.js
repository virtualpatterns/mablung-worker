import { Is } from '@virtualpatterns/mablung-is';
import Test from 'ava';

import { ErrorPool } from './error-pool.js';

Test('new ErrorPool()', async (test) => {

  if (Is.windows()) {
    test.throws(() => new ErrorPool({ 'numberOfProcess': 1 }), { 'code': 'UNKNOWN' });
  } else {

    let pool = new ErrorPool({ 'numberOfProcess': 1 });
    let error = await new Promise((resolve) => {

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

//# sourceMappingURL=error-pool.test.js.map