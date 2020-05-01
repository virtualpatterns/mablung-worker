import { createRequire as _createRequire } from "module";import Test from 'ava';

// import { LoggedClient } from './logged-client.js'
import { WorkerClient } from '../../index.js';

import { WorkerClientDurationExceededError } from '../../index.js';
import { WorkerClientRejectedError } from '../../library/error/worker-client-rejected-error.js';

const Process = process;
const Require = _createRequire(import.meta.url);

Test('new WorkerClient()', async test => {

  let worker = new WorkerClient();

  try {
    await test.notThrowsAsync(worker.ping());
  } finally {
    await worker.end();
  }

});

Test('WorkerClient.ping() throws WorkerClientDurationExceededError', async test => {

  let worker = new WorkerClient({ 'maximumDuration': 1 });

  try {
    await test.throwsAsync(worker.ping(), { 'instanceOf': WorkerClientDurationExceededError });
  } finally {
    // we can't use worker.kill() because it'll timeout
    Process.kill(worker.pid);
  }

});

Test('WorkerClient.import(url)', async test => {

  let worker = new WorkerClient();

  try {

    await worker.import(Require.resolve('./worker.js'));
    await test.throwsAsync(worker.import(Require.resolve('./worker.js')), { 'instanceOf': Error });

    test.is((await worker.getPid()), worker.pid);

  } finally {
    await worker.end();
  }

});

Test('WorkerClient.import(url) thows Error', async test => {

  let worker = new WorkerClient();

  try {

    await worker.import(Require.resolve('./worker.js'));

    await test.throwsAsync(worker._getPid(), { 'instanceOf': Error });

  } finally {
    await worker.end();
  }

});

Test('WorkerClient.release()', async test => {

  let worker = new WorkerClient();

  try {

    await worker.import(Require.resolve('./worker.js'));
    await worker.release();

    await test.throwsAsync(worker.getPid(), { 'instanceOf': Error });

  } finally {
    await worker.end();
  }

});

Test('WorkerClient.release() throws Error', async test => {

  let worker = new WorkerClient();

  try {

    await worker.import(Require.resolve('./worker.js'));
    await worker.release();

    await test.throwsAsync(worker.release(), { 'instanceOf': Error });

  } finally {
    await worker.end();
  }

});

Test('WorkerClient.getPid(duration) throws WorkerClientRejectedError', async test => {

  let worker = new WorkerClient();

  await worker.import(Require.resolve('./worker.js'));
  await test.throwsAsync(Promise.all([worker.getPid(2500), worker.end()]), { 'instanceOf': WorkerClientRejectedError });

});

Test('WorkerClient.whenMessageType(type) throws WorkerClientDurationExceededError', async test => {

  let worker = new WorkerClient();

  try {

    await worker.import(Require.resolve('./worker.js'));

    let maximumDuration = null;
    maximumDuration = worker.maximumDuration;

    worker.maximumDuration = 2000;
    await test.throwsAsync(worker.getPid(2500), { 'instanceOf': WorkerClientDurationExceededError });
    worker.maximumDuration = maximumDuration;

  } finally {
    await worker.end();
  }

});

Test('WorkerClient.whenRejected() throws WorkerClientDurationExceededError', async test => {

  let worker = new WorkerClient();

  await worker.ping(); // establish is ready before call to end

  let maximumDuration = null;
  maximumDuration = worker.maximumDuration;

  worker.maximumDuration = 1;
  await test.throwsAsync(worker.end(), { 'instanceOf': WorkerClientDurationExceededError });
  worker.maximumDuration = maximumDuration;

});

Test('WorkerClient.disconnect()', async test => {

  let worker = new WorkerClient();

  await test.notThrowsAsync(worker.ping()); // establishes is ready
  await worker.disconnect();
  await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' });

});

Test('WorkerClient.end()', async test => {

  let worker = new WorkerClient();

  await worker.end(); // also establishes is ready
  await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' });

});

Test('WorkerClient.kill()', async test => {

  let worker = new WorkerClient();

  await test.notThrowsAsync(worker.ping()); // establishes is ready
  await worker.kill();
  await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' });

});

Test('WorkerClient.uncaughtException()', async test => {

  let worker = new WorkerClient();

  await worker.uncaughtException(); // also establishes is ready
  await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' });

});

Test('WorkerClient.unhandledRejection()', async test => {

  // this test requires that unhandled promises exit the node process
  // this is enabled by the --unhandled-rejections=strict argument

  let worker = new WorkerClient();

  await worker.unhandledRejection(); // also establishes is ready
  await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' });

});
//# sourceMappingURL=worker-client.test.js.map