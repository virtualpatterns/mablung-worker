import Test from 'ava';

import { RandomWorkerPool } from '../../../index.js';

Test('RandomWorkerPool._selectProcessInformation()', async test => {

  let pool = new RandomWorkerPool();

  try {
    await test.notThrows(() => pool._selectProcessInformation());
  } finally {
    await pool.end();
  }


});
//# sourceMappingURL=random-worker-pool.test.js.map