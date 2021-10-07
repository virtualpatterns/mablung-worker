import Test from 'ava'

Test.before(async (test) => {
  test.context.index = await import('../index.js')
})

;[
  'ChildProcess',
  'ForkedProcess',
  'SpawnedProcess',
  'WorkerClient',
  'WorkerServer',
  'CreateLoggedProcess',
  'ChildProcessDurationExceededError',
  'ChildProcessExitedError',
  'ChildProcessKilledError',
  'ChildProcessSignalError'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(test.context.index[name])
  })
  
})
