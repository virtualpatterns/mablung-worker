"use strict";

var _sinon = _interopRequireDefault(require("sinon"));

var _ava = _interopRequireDefault(require("ava"));

var _loggedPool = require("./logged-pool.cjs");

var _index = require("../../index.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Require = require;
(0, _ava.default)('new WorkerPool()', async test => {
  let pool = null;
  test.notThrows(() => {
    pool = new _index.WorkerPool();
  });
  await test.notThrowsAsync(pool.exit());
});
(0, _ava.default)('new WorkerPool({ \'maximumDuration\': N })', async test => {
  let longMaximumDuration = 15000;
  let pool = new _index.WorkerPool({
    'maximumDuration': longMaximumDuration
  });

  try {
    test.is(pool.maximumDuration, longMaximumDuration);
  } finally {
    await pool.exit();
  }
});
(0, _ava.default)('WorkerPool.maximumDuration', async test => {
  let shortMaximumDuration = 5000;
  let longMaximumDuration = 15000;
  let pool = new _index.WorkerPool();

  try {
    pool.maximumDuration = shortMaximumDuration;
    test.is(pool.maximumDuration, shortMaximumDuration);
    pool.maximumDuration = longMaximumDuration;
  } finally {
    await pool.exit();
  }
});
(0, _ava.default)('WorkerPool._selectProcess(methodName, parameter)', async test => {
  const sandbox = _sinon.default.createSandbox();

  try {
    let pool = new _index.WorkerPool(Require.resolve("./worker.cjs"));

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
(0, _ava.default)('WorkerPool.ping()', async test => {
  let pool = new _index.WorkerPool();

  try {
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.exit();
  }
});

_ava.default.only('WorkerPool.ping() throws WorkerPoolDisconnectedError', async test => {
  let pool = new _index.WorkerPool({
    'numberOfProcess': 1
  });
  await pool.exit();
  await test.throwsAsync(pool.ping(), {
    'instanceOf': _index.WorkerPoolDisconnectedError
  });
});

(0, _ava.default)('WorkerPool.exit(option)', async test => {
  await test.notThrowsAsync(new _index.WorkerPool().exit());
});
(0, _ava.default)('WorkerPool.exit(option) throws WorkerPoolDisconnectedError', async test => {
  let pool = new _index.WorkerPool({
    'numberOfProcess': 1
  });
  await pool.exit();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.throwsAsync(pool.exit(), {
    'instanceOf': _index.WorkerPoolDisconnectedError
  });
});
(0, _ava.default)('WorkerPool.module.throwUncaughtException()', async test => {
  let pool = new _index.WorkerPool(Require.resolve("./worker.cjs"), {
    'numberOfProcess': 1
  });

  try {
    await test.notThrowsAsync(pool.module.throwUncaughtException()); // the pool should recreate exited processes

    await new Promise(resolve => setTimeout(resolve, 1000));
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.exit();
  }
});
(0, _ava.default)('WorkerPool.module.rejectUnhandledException()', async test => {
  // this test requires that the node process exit when a Promise rejection is unhandled
  // as established by the --unhandled-rejections=strict parameter to node
  let pool = new _index.WorkerPool(Require.resolve("./worker.cjs"), {
    'numberOfProcess': 1
  });

  try {
    await test.notThrowsAsync(pool.module.rejectUnhandledException()); // the pool should recreate exited processes

    await new Promise(resolve => setTimeout(resolve, 1000));
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.exit();
  }
});
(0, _ava.default)('WorkerPool.disconnect()', async test => {
  let pool = new _index.WorkerPool({
    'numberOfProcess': 1
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.notThrowsAsync(pool.disconnect()); // disconnect causes a normal code = 0 exit, the pool will not recreate exited processes

  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.throwsAsync(pool.ping(), {
    'instanceOf': _index.WorkerPoolDisconnectedError
  });
});
(0, _ava.default)('WorkerPool.disconnect() throws WorkerPoolDisconnectedError', async test => {
  let pool = new _index.WorkerPool({
    'numberOfProcess': 1
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.notThrowsAsync(pool.disconnect()); // disconnect causes a normal code = 0 exit, the pool will not recreate exited processes

  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.throwsAsync(pool.disconnect(), {
    'instanceOf': _index.WorkerPoolDisconnectedError
  });
});
(0, _ava.default)('WorkerPool.kill()', async test => {
  // use LoggedPool so that the if condition of _recreateProcess regarding the stream is called
  let pool = new _loggedPool.LoggedPool({
    'numberOfProcess': 1
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    await test.notThrowsAsync(pool.kill()); // the pool should recreate killed processes

    await new Promise(resolve => setTimeout(resolve, 1000));
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.exit();
  }
});
(0, _ava.default)('WorkerPool.kill() throws WorkerPoolDisconnectedError', async test => {
  let pool = new _index.WorkerPool({
    'numberOfProcess': 1
  });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.notThrowsAsync(pool.disconnect()); // disconnect causes a normal code = 0 exit, the pool will not recreate exited processes

  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.throwsAsync(pool.kill(), {
    'instanceOf': _index.WorkerPoolDisconnectedError
  });
});
//# sourceMappingURL=worker-pool.test.cjs.map