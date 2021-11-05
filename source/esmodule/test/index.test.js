import Test from 'ava'

Test.before(async (test) => {
  test.context.index = await import('@virtualpatterns/mablung-worker')
})

;[
  'ChildProcess',
  'ForkedProcess',
  'SpawnedProcess',
  'WorkerClient',
  'WorkerServer',
  'ChildProcessDurationExceededError',
  'ChildProcessExitedError',
  'ChildProcessKilledError',
  'ChildProcessSignalError',
  'WorkerServerInvalidMessageError',
  'WorkerServerInvalidPropertyError',
  'WorkerServerNoIPCChannelError'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(test.context.index[name])
  })
  
})
