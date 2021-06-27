import Test from 'ava'

import { LoggedClient } from './logged-client.js'
import { WorkerClient } from '../../index.js'

import { WorkerClientDurationExceededError } from '../../index.js'
import { WorkerClientRejectedError } from '../../library/error/worker-client-rejected-error.js'

const Require = __require

Test('new WorkerClient()', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new LoggedClient()})
  await test.notThrowsAsync(worker.exit())

})

Test('new WorkerClient(path, option)', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new WorkerClient(Require.resolve('./worker.js'), { 'maximumDuration': 10000 })})
  await test.notThrowsAsync(worker.exit())

})

Test('new WorkerClient(option, option)', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new WorkerClient({ '--import-path': Require.resolve('./worker.js') }, { 'maximumDuration': 10000 })})
  await test.notThrowsAsync(worker.exit())

})

Test('new WorkerClient(path, option, option)', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new WorkerClient(Require.resolve('../../library/create-worker-server.js'), { '--import-path': Require.resolve('./worker.js') }, { 'maximumDuration': 10000 })})
  await test.notThrowsAsync(worker.exit())

})

Test('WorkerClient.module.getPid()', async (test) => {

  let worker = new WorkerClient()

  try {
    test.is(await worker.module.getPid(), worker.pid)
  } finally {
    await worker.exit()
  }
  
})

Test('WorkerClient._onPing(message)', async (test) => {

  let worker = new WorkerClient()

  try {
    await test.notThrowsAsync(worker.ping())
  } finally {
    await worker.exit()
  }

})

Test('WorkerClient._onApply(message)', async (test) => {

  let worker = new WorkerClient(Require.resolve('./worker.js'))

  try {
    test.is(await worker.module.getPid(), worker.pid)
  } finally {
    await worker.exit()
  }

})

Test('WorkerClient._onTerminate(signal)', async (test) => {

  let worker = new WorkerClient()

  await test.notThrowsAsync(worker.ping()) // establishes is ready
  await worker.kill()
  await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

})

Test('WorkerClient.maximumDuration', async (test) => {

  let maximumDuration = 10000
  let worker = new WorkerClient({ 'maximumDuration': maximumDuration })

  try {

    test.is(worker.maximumDuration, maximumDuration)
    test.is(worker.option.maximumDuration, maximumDuration)

    worker.maximumDuration = maximumDuration = 5000

    test.is(worker.maximumDuration, maximumDuration)
    test.is(worker.option.maximumDuration, maximumDuration)

  } finally {
    await worker.exit()
  }

})

Test('WorkerClient.module.getPid(duration) throws WorkerClientRejectedError', async (test) => {

  let worker = new WorkerClient(Require.resolve('./worker.js'))

  await test.throwsAsync(Promise.all([ worker.module.getPid(2500), worker.exit() ]), { 'instanceOf': WorkerClientRejectedError })

})

Test('WorkerClient.ping() throws WorkerClientDurationExceededError', async (test) => {

  let worker = new WorkerClient()

  try {

    let maximumDuration = null
    maximumDuration = worker.maximumDuration

    worker.maximumDuration = 1    
    await test.throwsAsync(worker.ping(), { 'instanceOf': WorkerClientDurationExceededError })
    worker.maximumDuration = maximumDuration    

  } finally {
    await worker.exit()
  }

})

Test('WorkerClient.exit() throws WorkerClientDurationExceededError', async (test) => {

  let worker = new WorkerClient()

  await worker.ping() // establish ready

  let maximumDuration = null
  maximumDuration = worker.maximumDuration

  worker.maximumDuration = 1    
  await test.throwsAsync(worker.exit(), { 'instanceOf': WorkerClientDurationExceededError })
  worker.maximumDuration = maximumDuration    

})

Test('WorkerClient.module.throwException(duration) throws WorkerExceptionError', async (test) => {

  let worker = new WorkerClient(Require.resolve('./worker.js'))

  try {
    await test.throwsAsync(worker.module.throwException(), { 'message': 'WorkerExceptionError' })
  } finally {
    await worker.exit()
  }

})

Test('WorkerClient.disconnect()', async (test) => {

  let worker = new WorkerClient()

  await worker.ping() // establish ready
  await test.notThrowsAsync(worker.disconnect())

})

Test('WorkerClient.module.then', async (test) => {

  let worker = new WorkerClient()

  try {
    test.falsy(worker.module.then)
  } finally {
    await worker.exit()
  }

})
