import Test from 'ava'

Test.before(async (test) => {
  test.context.index = await import('../index.js')
})

;[
  'WorkerClient',

  'WorkerClientDisconnectedError',
  'WorkerClientDurationExceededError',
  'WorkerClientExitedError',
  'WorkerClientInternalError',
  'WorkerClientTerminatedError'

].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(test.context.index[name])
  })
  
})
