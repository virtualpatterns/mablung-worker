import Test from 'ava';

import { RandomWorkerPool } from '../../../index.js';

Test('RandomWorkerPool._selectProcess()', async test => {

  let pool = new RandomWorkerPool();

  try {
    await test.notThrows(() => pool._selectProcess());
  } finally {
    await pool.end();
  }


});
//# sourceMappingURL=random-worker-pool.test.js.map