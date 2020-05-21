import Test from 'ava';

import { NextWorkerPool } from '../../../index.js';

Test('NextWorkerPool._selectProcessInformation()', async test => {

  let pool = new NextWorkerPool();

  try {
    await test.notThrows(() => pool._selectProcessInformation());
  } finally {
    await pool.end();
  }


});
//# sourceMappingURL=next-worker-pool.test.js.map