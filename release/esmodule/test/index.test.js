import Test from 'ava';

Test.before(async (test) => {
  test.context.index = await import('../index.js');
});

[
'ChildProcess',
'ForkedProcess',
'WorkerClient',
'WorkerPool',
'NextWorkerPool',
'RandomWorkerPool',
'WorkerClientDisconnectedError',
'WorkerClientDurationExceededError',
'WorkerClientExitedError',
'WorkerClientInternalError',
'WorkerClientKilledError',
'WorkerPoolDisconnectedError',
'LoggedClient',
'LoggedPool'].
forEach((name) => {

  Test(name, async (test) => {
    test.truthy(test.context.index[name]);
  });

});

//# sourceMappingURL=index.test.js.map