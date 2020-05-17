import { createRequire as _createRequire } from "module";import Test from 'ava';

import { LoggedPool } from './logged-pool.js';
import { WorkerPool } from '../../index.js';

import { WorkerClientDurationExceededError } from '../../index.js';
import { WorkerClientRejectedError } from '../../library/error/worker-client-rejected-error.js';

const Process = process;
const Require = _createRequire(import.meta.url);

Test('new WorkerPool()', async test => {

  let pool = new WorkerPool();

  try {
    await test.notThrowsAsync(pool.ping());
  } finally {
    await pool.end();
  }

});

Test('WorkerPool.ping() throws WorkerClientDurationExceededError', async test => {

  let pool = new WorkerPool();

  try {
    await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerClientDurationExceededError });
  } finally {
    // we can't use pool.kill() because it'll timeout
    pool.connectedProcess.forEach(({ process: worker }) => Process.kill(worker.pid));
  }

});

Test('WorkerPool.import(url)', async test => {

  let pool = new WorkerPool();

  try {

    let allPid = await pool.import(Require.resolve('./worker.js'));
    let onePid = await pool.module.getPid();

    test.assert(allPid.includes(onePid));
    await test.throwsAsync(pool.import(Require.resolve('./worker.js')), { 'instanceOf': Error });

  } finally {
    await pool.end();
  }

});

Test.only('WorkerPool.import(url) throws Error', async test => {

  let pool = new LoggedPool({ 'numberOfProcess': 3 });

  try {

    await pool.import(Require.resolve('./worker.js'));

    await test.throwsAsync(pool.module._getPid(), { 'instanceOf': Error });

  } finally {
    await pool.end();
  }

});

// Test('WorkerPool.release()', async (test) => {

//   let worker = new WorkerPool()

//   try {

//     let pid = null
//     pid = await worker.import(Require.resolve('./worker.js'))
//     pid = await worker.release()

//     test.is(pid, worker.pid)
//     await test.throws(() => { worker.module.getPid() }, { 'instanceOf': TypeError })

//   } finally {
//     await worker.end()
//   }

// })

// Test('WorkerPool.release() throws Error', async (test) => {

//   let worker = new WorkerPool()

//   try {

//     await worker.import(Require.resolve('./worker.js'))
//     await worker.release()

//     await test.throwsAsync(worker.release(), { 'instanceOf': Error })

//   } finally {
//     await worker.end()
//   }

// })

// Test('WorkerPool.getPid(duration) throws WorkerClientRejectedError', async (test) => {

//   let worker = new WorkerPool()

//   await worker.import(Require.resolve('./worker.js'))
//   await test.throwsAsync(Promise.all([ worker.module.getPid(2500), worker.end() ]), { 'instanceOf': WorkerClientRejectedError })

// })

// Test('WorkerPool.whenMessageType(type) throws WorkerClientDurationExceededError', async (test) => {

//   let worker = new WorkerPool()

//   try {

//     await worker.import(Require.resolve('./worker.js'))

//     let maximumDuration = null
//     maximumDuration = worker.maximumDuration

//     worker.maximumDuration = 2000
//     await test.throwsAsync(worker.module.getPid(2500), { 'instanceOf': WorkerClientDurationExceededError })
//     worker.maximumDuration = maximumDuration

//   } finally {
//     await worker.end()
//   }

// })

// Test('WorkerPool.whenRejected() throws WorkerClientDurationExceededError', async (test) => {

//   let worker = new WorkerPool()

//   await worker.ping() // establish is ready before call to end

//   let maximumDuration = null
//   maximumDuration = worker.maximumDuration

//   worker.maximumDuration = 1
//   await test.throwsAsync(worker.end(), { 'instanceOf': WorkerClientDurationExceededError })
//   worker.maximumDuration = maximumDuration

// })

// Test('WorkerPool.disconnect()', async (test) => {

//   let worker = new WorkerPool()

//   await test.notThrowsAsync(worker.ping()) // establishes is ready
//   await worker.disconnect()
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })

// Test('WorkerPool.end()', async (test) => {

//   let worker = new WorkerPool() // LoggedClient() // 

//   // this import is required because it contains the onEnd method
//   await worker.import(Require.resolve('./worker.js'))

//   await worker.end({ 'pid': worker.pid }) // also establishes is ready
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })

// Test('WorkerPool.kill()', async (test) => {

//   let worker = new WorkerPool()

//   await test.notThrowsAsync(worker.ping()) // establishes is ready
//   await worker.kill()
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })

// Test('WorkerPool.uncaughtException()', async (test) => {

//   let worker = new WorkerPool()

//   await worker.uncaughtException() // also establishes is ready
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })

// Test('WorkerPool.unhandledRejection()', async (test) => {

//   // this test requires that unhandled promises exit the node process
//   // this is enabled by the --unhandled-rejections=strict argument

//   let worker = new WorkerPool()

//   await worker.unhandledRejection() // also establishes is ready
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })
//# sourceMappingURL=worker-pool.test.js.map