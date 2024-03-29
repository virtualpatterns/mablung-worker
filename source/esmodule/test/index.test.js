import Test from 'ava'

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
    test.truthy(await import('@virtualpatterns/mablung-worker').then((module) => module[name]))
  })
  
})

;[
  'CreateRandomId',
  'CreateLoggedProcess',
  'LoggedForkedProcess', 
  'LoggedSpawnedProcess', 
  'LoggedWorkerClient'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(await import('@virtualpatterns/mablung-worker/test').then((module) => module[name]))
  })
  
})
