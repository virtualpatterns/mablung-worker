import { createRequire as _createRequire } from "module";import Test from 'ava';

import { LoggedPool } from './logged-pool.js';
import { WorkerPool } from '../../index.js';

import { WorkerClientDurationExceededError, WorkerPoolDisconnectedError } from '../../index.js';
import { WorkerClientRejectedError } from '../../library/error/worker-client-rejected-error.js';

const Process = process;
const Require = _createRequire(import.meta.url);

Test('new WorkerPool()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.end();
  }

});

Test('WorkerPool.ping() throws WorkerClientDurationExceededError', async test => {

  let pool = new WorkerPool({ 'maximumDuration': 1, 'numberOfProcess': 2 });

  try {
    await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerClientDurationExceededError });
  } finally {
    // we can't use pool.kill() because it'll timeout
    pool.getConnectedProcessInformation().forEach(({ process: worker }) => Process.kill(worker.pid));
  }

});

Test('WorkerPool.import(url)', async test => {

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

Test('WorkerPool.import(url) throws Error', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await pool.import(Require.resolve('./worker.js'));

    await test.throwsAsync(pool.module._getPid(), { 'instanceOf': Error });

  } finally {
    await pool.end();
  }

});

Test('WorkerPool.release()', async test => {

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

Test('WorkerPool.release() throws Error', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await pool.import(Require.resolve('./worker.js'));
    await pool.release();

    await test.throwsAsync(pool.release(), { 'instanceOf': Error });

  } finally {
    await pool.end();
  }

});

Test('WorkerPool.getPid(duration) throws WorkerClientRejectedError', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  await pool.import(Require.resolve('./worker.js'));
  await test.throwsAsync(Promise.all([pool.module.getPid(2500), pool.end()]), { 'instanceOf': WorkerClientRejectedError });

});

Test('WorkerPool.whenMessageType(type) throws WorkerClientDurationExceededError', async test => {

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

Test('WorkerPool.whenRejected() throws WorkerClientDurationExceededError', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  await pool.ping(); // establish is ready before call to end

  let maximumDuration = null;
  maximumDuration = pool.maximumDuration;

  pool.maximumDuration = 1;
  await test.throwsAsync(pool.end(), { 'instanceOf': WorkerClientDurationExceededError });
  pool.maximumDuration = maximumDuration;

});

Test('WorkerPool.disconnect()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  await test.notThrowsAsync(pool.ping()); // establishes is ready
  await pool.disconnect();
  await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerPoolDisconnectedError });

});

Test('WorkerPool.end()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  // this import is required because it contains the onEnd method
  await pool.import(Require.resolve('./worker.js'));

  await pool.end({ 'pid': 10000 }); // also establishes is ready
  await test.throwsAsync(pool.ping()); // , { 'instanceOf': WorkerPoolDisconnectedError })

});

Test('WorkerPool.kill()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await test.notThrowsAsync(pool.ping()); // establishes is ready
    await pool.kill();
    await test.notThrowsAsync(pool.ping()); // the pool should recreate killed processes

  } finally {
    await pool.end();
  }

});

Test('WorkerPool.uncaughtException()', async test => {

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await pool.uncaughtException();
    await test.notThrowsAsync(pool.ping()); // the pool should recreate exited processes

  } finally {
    await pool.end();
  }

});

Test('WorkerPool.unhandledRejection()', async test => {

  // this test requires that unhandled promises exit the node process
  // this is enabled by the --unhandled-rejections=strict argument

  let pool = new WorkerPool({ 'numberOfProcess': 2 });

  try {

    await pool.unhandledRejection();
    await test.notThrowsAsync(pool.ping()); // the pool should recreate exited processes

  } finally {
    await pool.end();
  }

});

Test('WorkerPool.kill() when maximumNumberOfCreate is 0', async test => {

  let pool = new WorkerPool({ 'maximumNumberOfCreate': 0, 'numberOfProcess': 2 });

  await test.notThrowsAsync(pool.ping()); // establishes is ready
  await pool.kill();
  await test.throwsAsync(pool.ping()); // the pool will not recreate killed processes

});
//# sourceMappingURL=worker-pool.test.js.map