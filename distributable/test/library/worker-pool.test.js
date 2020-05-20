import { createRequire as _createRequire } from "module";import Sinon from 'sinon';
import Test from 'ava';

import { LoggedPool } from './logged-pool.js';
import { WorkerPool } from '../../index.js';

import { WorkerClientDurationExceededError, WorkerPoolDisconnectedError } from '../../index.js';
import { WorkerClientRejectedError } from '../../library/error/worker-client-rejected-error.js';

const Process = process;
const Require = _createRequire(import.meta.url);

Test('new WorkerPool()', async test => {

  let pool = null;

  test.notThrows(() => {pool = new WorkerPool();});
  await test.notThrowsAsync(pool.end());

});

Test('new WorkerPool({ \'maximumDuration\': N })', async test => {

  let longMaximumDuration = 5000;
  let pool = new WorkerPool({ 'maximumDuration': longMaximumDuration });

  try {
    test.is(pool.maximumDuration, longMaximumDuration);
  } finally {
    await pool.end();
  }

});

Test('WorkerPool.maximumDuration', async test => {

  let shortMaximumDuration = 1000;
  let longMaximumDuration = 5000;

  let pool = new WorkerPool();

  try {

    pool.maximumDuration = shortMaximumDuration;
    test.is(pool.maximumDuration, shortMaximumDuration);
    pool.maximumDuration = longMaximumDuration;

  } finally {
    await pool.end();
  }

});

Test('WorkerPool._selectProcessInformation(methodName, parameter)', async test => {

  const sandbox = Sinon.createSandbox();

  try {

    let pool = new WorkerPool(Require.resolve('./worker.js'));

    try {
      sandbox.spy(pool, '_selectProcessInformation');
      await pool.module.getPid();
      test.true(pool._selectProcessInformation.calledOnce);
    } finally {
      await pool.end();
    }

  } finally {
    sandbox.restore();
  }

});

Test('WorkerPool.ping()', async test => {

  let pool = new WorkerPool();

  try {
    // does not show the code as executed :-(
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.end();
  }

});

Test('WorkerPool.ping() throws WorkerPoolDisconnectedError', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 1 });

  await pool.end();
  await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerPoolDisconnectedError });

});

Test('WorkerPool.end(option)', async test => {
  await test.notThrowsAsync(new WorkerPool().end());
});

Test('WorkerPool.end(option) throws WorkerPoolDisconnectedError', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 1 });

  await pool.end();
  await test.throws(() => {pool.end();}, { 'instanceOf': WorkerPoolDisconnectedError });

});

Test('WorkerPool.module.throwUncaughtException()', async test => {

  let pool = new WorkerPool(Require.resolve('./worker.js'), { 'numberOfProcess': 1 });

  try {
    await test.notThrowsAsync(pool.module.throwUncaughtException()); // the pool should recreate exited processes
    await new Promise(resolve => setTimeout(resolve, 1000));
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.end();
  }

});

Test('WorkerPool.module.rejectUnhandledException()', async test => {

  let pool = new WorkerPool(Require.resolve('./worker.js'), { 'numberOfProcess': 1 });

  try {
    await test.notThrowsAsync(pool.module.rejectUnhandledException()); // the pool should recreate exited processes
    await new Promise(resolve => setTimeout(resolve, 1000));
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.end();
  }

});

Test.only('WorkerPool.disconnect()', async test => {

  let pool = new LoggedPool({ 'numberOfProcess': 1 });

  await new Promise(resolve => setTimeout(resolve, 4000));
  await test.notThrowsAsync(pool.disconnect()); // the pool should recreate exited processes
  await new Promise(resolve => setTimeout(resolve, 1000));
  await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerPoolDisconnectedError });

});

Test.skip('WorkerPool.uncaughtException()', async test => {

  let pool = new WorkerPool();

  try {

    await pool.uncaughtException();
    await test.notThrowsAsync(pool.ping()); // the pool should recreate exited processes

  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.unhandledRejection()', async test => {

  // this test requires that unhandled promises exit the node process
  // this is enabled by the --unhandled-rejections=strict argument

  let pool = new LoggedPool();

  try {

    await pool.unhandledRejection();
    await test.notThrowsAsync(pool.ping()); // the pool should recreate exited processes

  } finally {
    await pool.end();
  }

});

Test.skip('new WorkerPool({ \'numberOfProcess\': 2 })', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {
    test.is(pool._getConnectedProcessInformation().length, 2);
  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.whenMessageType(type) throws WorkerClientDurationExceededError', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await pool.import(Require.resolve('./worker.js'));

    let maximumDuration = null;
    maximumDuration = pool.maximumDuration;

    pool.maximumDuration = 2000;
    await test.throwsAsync(pool.module.getPid(2500), { 'instanceOf': WorkerClientDurationExceededError });
    pool.maximumDuration = maximumDuration;

  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.ping() throws WorkerClientDurationExceededError', async test => {

  let pool = new WorkerPool({ 'maximumDuration': 1, 'numberOfProcess': 2 });

  try {
    await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerClientDurationExceededError });
  } finally {
    // we can't use pool.kill() because it'll timeout
    pool._getConnectedProcessInformation().forEach(({ process: worker }) => Process.kill(worker.pid));
  }

});

Test.skip('WorkerPool.import(url)', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    let allPid = await pool.import(Require.resolve('./worker.js'));
    let onePid = await pool.module.getPid();

    test.assert(allPid.includes(onePid));
    await test.throwsAsync(pool.import(Require.resolve('./worker.js')), { 'instanceOf': Error });

  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.import(url) throws Error', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await pool.import(Require.resolve('./worker.js'));

    await test.throwsAsync(pool.module._getPid(), { 'instanceOf': Error });

  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.release()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    let allPid = await pool.import(Require.resolve('./worker.js'));
    let onePid = await pool.module.getPid();

    allPid = await pool.release();

    test.assert(allPid.includes(onePid));
    test.is(pool.module, null);

  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.release() throws Error', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await pool.import(Require.resolve('./worker.js'));
    await pool.release();

    await test.throwsAsync(pool.release(), { 'instanceOf': Error });

  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.getPid(duration) throws WorkerClientRejectedError', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  await pool.import(Require.resolve('./worker.js'));
  await test.throwsAsync(Promise.all([pool.module.getPid(2500), pool.end()]), { 'instanceOf': WorkerClientRejectedError });

});

Test.skip('WorkerPool.whenRejected() throws WorkerClientDurationExceededError', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  await pool.ping(); // establish is ready before call to end

  let maximumDuration = null;
  maximumDuration = pool.maximumDuration;

  pool.maximumDuration = 1;
  await test.throwsAsync(pool.end(), { 'instanceOf': WorkerClientDurationExceededError });
  pool.maximumDuration = maximumDuration;

});

Test.skip('WorkerPool.end()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  // this import is required because it contains the onEnd method
  await pool.import(Require.resolve('./worker.js'));

  await pool.end({ 'pid': 10000 }); // also establishes is ready
  await test.throwsAsync(pool.ping()); // , { 'instanceOf': WorkerPoolDisconnectedError })

});

Test.skip('WorkerPool.kill()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await test.notThrowsAsync(pool.ping()); // establishes is ready
    await pool.kill();
    await test.notThrowsAsync(pool.ping()); // the pool should recreate killed processes

  } finally {
    await pool.end();
  }

});

Test.skip('WorkerPool.kill() when maximumNumberOfCreate is 0', async test => {

  let pool = new WorkerPool({ 'maximumNumberOfCreate': 0, 'numberOfProcess': 2 });

  await test.notThrowsAsync(pool.ping()); // establishes is ready
  await pool.kill();
  await test.throwsAsync(pool.ping()); // the pool will not recreate killed processes

});
//# sourceMappingURL=worker-pool.test.js.map