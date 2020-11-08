"use strict";

var _ava = _interopRequireDefault(require("ava"));

var _index = require("../../index.cjs");

var _workerClientRejectedError = require("../../library/error/worker-client-rejected-error.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { LoggedClient } from './logged-client.js'
const Require = require;
(0, _ava.default)('new WorkerClient()', async test => {
  let worker = null;
  test.notThrows(() => {
    worker = new _index.WorkerClient();
  });
  await test.notThrowsAsync(worker.exit());
});
(0, _ava.default)('new WorkerClient(path, option)', async test => {
  let worker = null;
  test.notThrows(() => {
    worker = new _index.WorkerClient(Require.resolve("./worker.cjs"), {
      'maximumDuration': 10000
    });
  });
  await test.notThrowsAsync(worker.exit());
});
(0, _ava.default)('new WorkerClient(option, option)', async test => {
  let worker = null;
  test.notThrows(() => {
    worker = new _index.WorkerClient({
      '--import-path': Require.resolve("./worker.cjs")
    }, {
      'maximumDuration': 10000
    });
  });
  await test.notThrowsAsync(worker.exit());
});
(0, _ava.default)('new WorkerClient(path, option, option)', async test => {
  let worker = null;
  test.notThrows(() => {
    worker = new _index.WorkerClient(Require.resolve("../../library/create-worker-server.cjs"), {
      '--import-path': Require.resolve("./worker.cjs")
    }, {
      'maximumDuration': 10000
    });
  });
  await test.notThrowsAsync(worker.exit());
});
(0, _ava.default)('WorkerClient.module.getPid()', async test => {
  let worker = new _index.WorkerClient();

  try {
    test.is(await worker.module.getPid(), worker.pid);
  } finally {
    await worker.exit();
  }
});
(0, _ava.default)('WorkerClient._onPing(message)', async test => {
  let worker = new _index.WorkerClient();

  try {
    await test.notThrowsAsync(worker.ping());
  } finally {
    await worker.exit();
  }
});
(0, _ava.default)('WorkerClient._onApply(message)', async test => {
  let worker = new _index.WorkerClient(Require.resolve("./worker.cjs"));

  try {
    test.is(await worker.module.getPid(), worker.pid);
  } finally {
    await worker.exit();
  }
});
(0, _ava.default)('WorkerClient._onTerminate(signal)', async test => {
  let worker = new _index.WorkerClient();
  await test.notThrowsAsync(worker.ping()); // establishes is ready

  await worker.kill();
  await test.throwsAsync(worker.ping(), {
    'code': 'ERR_IPC_CHANNEL_CLOSED'
  });
});
(0, _ava.default)('WorkerClient.maximumDuration', async test => {
  let maximumDuration = 10000;
  let worker = new _index.WorkerClient({
    'maximumDuration': maximumDuration
  });

  try {
    test.is(worker.maximumDuration, maximumDuration);
    test.is(worker.option.maximumDuration, maximumDuration);
    worker.maximumDuration = maximumDuration = 5000;
    test.is(worker.maximumDuration, maximumDuration);
    test.is(worker.option.maximumDuration, maximumDuration);
  } finally {
    await worker.exit();
  }
});
(0, _ava.default)('WorkerClient.module.getPid(duration) throws WorkerClientRejectedError', async test => {
  let worker = new _index.WorkerClient(Require.resolve("./worker.cjs"));
  await test.throwsAsync(Promise.all([worker.module.getPid(2500), worker.exit()]), {
    'instanceOf': _workerClientRejectedError.WorkerClientRejectedError
  });
});
(0, _ava.default)('WorkerClient.ping() throws WorkerClientDurationExceededError', async test => {
  let worker = new _index.WorkerClient();

  try {
    let maximumDuration = null;
    maximumDuration = worker.maximumDuration;
    worker.maximumDuration = 1;
    await test.throwsAsync(worker.ping(), {
      'instanceOf': _index.WorkerClientDurationExceededError
    });
    worker.maximumDuration = maximumDuration;
  } finally {
    await worker.exit();
  }
});
(0, _ava.default)('WorkerClient.exit() throws WorkerClientDurationExceededError', async test => {
  let worker = new _index.WorkerClient();
  await worker.ping(); // establish ready

  let maximumDuration = null;
  maximumDuration = worker.maximumDuration;
  worker.maximumDuration = 1;
  await test.throwsAsync(worker.exit(), {
    'instanceOf': _index.WorkerClientDurationExceededError
  });
  worker.maximumDuration = maximumDuration;
});
(0, _ava.default)('WorkerClient.module.throwException(duration) throws WorkerExceptionError', async test => {
  let worker = new _index.WorkerClient(Require.resolve("./worker.cjs"));

  try {
    await test.throwsAsync(worker.module.throwException(), {
      'message': 'WorkerExceptionError'
    });
  } finally {
    await worker.exit();
  }
});
(0, _ava.default)('WorkerClient.disconnect()', async test => {
  let worker = new _index.WorkerClient();
  await worker.ping(); // establish ready

  await test.notThrowsAsync(worker.disconnect());
});
(0, _ava.default)('WorkerClient.module.then', async test => {
  let worker = new _index.WorkerClient();

  try {
    test.falsy(worker.module.then);
  } finally {
    await worker.exit();
  }
});
//# sourceMappingURL=worker-client.test.cjs.map