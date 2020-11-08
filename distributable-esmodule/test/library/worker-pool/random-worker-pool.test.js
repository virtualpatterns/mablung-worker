import { createRequire as _createRequire } from "module";import Sinon from 'sinon';
import Test from 'ava';

import { RandomWorkerPool } from '../../../index.js';

const Require = _createRequire(import.meta.url);

Test('RandomWorkerPool._selectProcess(methodName, parameter)', async test => {

  const sandbox = Sinon.createSandbox();

  try {

    let pool = new RandomWorkerPool(Require.resolve('../worker.js'));

    try {

      sandbox.spy(pool, '_selectProcess');

      await pool.module.getPid();

      test.true(pool._selectProcess.calledOnce);
      test.true(pool._selectProcess.calledWith('getPid', []));

    } finally {
      await pool.exit();
    }

  } finally {
    sandbox.restore();
  }

});
//# sourceMappingURL=random-worker-pool.test.js.map