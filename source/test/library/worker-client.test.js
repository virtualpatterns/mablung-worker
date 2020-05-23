import Test from 'ava'

import { LoggedClient } from './logged-client.js'
import { WorkerClient } from '../../index.js'

import { WorkerClientDurationExceededError } from '../../index.js'
import { WorkerClientRejectedError } from '../../library/error/worker-client-rejected-error.js'

const Require = __require

Test('new WorkerClient()', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new WorkerClient()})
  await test.notThrowsAsync(worker.exit())

})

Test('new WorkerClient(path, option)', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new WorkerClient(Require.resolve('./worker.js'), { 'maximumDuration': 5000 })})
  await test.notThrowsAsync(worker.exit())

})

Test('new WorkerClient(option, option)', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new WorkerClient({ '--import-path': Require.resolve('./worker.js') }, { 'maximumDuration': 5000 })})
  await test.notThrowsAsync(worker.exit())

})

Test('new WorkerClient(path, option, option)', async (test) => {

  let worker = null
  
  test.notThrows(() => { worker = new WorkerClient(Require.resolve('../../library/create-worker-server.js'), { '--import-path': Require.resolve('./worker.js') }, { 'maximumDuration': 5000 })})
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

  let maximumDuration = 2000
  let worker = new WorkerClient({ 'maximumDuration': maximumDuration })

  try {

    test.is(worker.maximumDuration, maximumDuration)
    test.is(worker.option.maximumDuration, maximumDuration)

    worker.maximumDuration = maximumDuration = 15000

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

    worker.maximumDuration = 1000    
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

// Test.skip('WorkerClient.import(url)', async (test) => {

//   let worker = new WorkerClient()

//   try {
   
//     let pid = await worker.import(Require.resolve('./worker.js'))
//     test.is(pid, worker.pid)

//     await test.throwsAsync(worker.import(Require.resolve('./worker.js')), { 'instanceOf': Error })
//     test.is(await worker.module.getPid(), worker.pid)

//   } finally {
//     await worker.exit()
//   }

// })

// Test.skip('WorkerClient.import(url) throws Error', async (test) => {

//   let worker = new WorkerClient()

//   try {

//     await worker.import(Require.resolve('./worker.js'))

//     await test.throwsAsync(worker.module._getPid(), { 'instanceOf': Error })

//   } finally {
//     await worker.exit()
//   }

// })

// Test.skip('WorkerClient.release()', async (test) => {

//   let worker = new WorkerClient()

//   try {

//     let pid = null
//     pid = await worker.import(Require.resolve('./worker.js'))
//     pid = await worker.release()

//     test.is(pid, worker.pid)
//     test.is(worker.module, null)

//   } finally {
//     await worker.exit()
//   }

// })

// Test.skip('WorkerClient.release() throws Error', async (test) => {

//   let worker = new WorkerClient()

//   try {

//     await worker.import(Require.resolve('./worker.js'))
//     await worker.release()

//     await test.throwsAsync(worker.release(), { 'instanceOf': Error })

//   } finally {
//     await worker.exit()
//   }

// })

// Test.skip('WorkerClient.getPid(duration) throws WorkerClientRejectedError', async (test) => {

//   let worker = new WorkerClient()

//   await worker.import(Require.resolve('./worker.js'))
//   await test.throwsAsync(Promise.all([ worker.module.getPid(2500), worker.exit() ]), { 'instanceOf': WorkerClientRejectedError })

// })

// Test.skip('WorkerClient.whenMessageType(type) throws WorkerClientDurationExceededError', async (test) => {

//   let worker = new WorkerClient()

//   try {

//     await worker.import(Require.resolve('./worker.js'))

//     let maximumDuration = null
//     maximumDuration = worker.maximumDuration

//     worker.maximumDuration = 2000
//     await test.throwsAsync(worker.module.getPid(2500), { 'instanceOf': WorkerClientDurationExceededError })
//     worker.maximumDuration = maximumDuration

//   } finally {
//     await worker.exit()
//   }

// })

// Test.skip('WorkerClient.whenRejected() throws WorkerClientDurationExceededError', async (test) => {

//   let worker = new WorkerClient()

//   await worker.ping() // establish is ready before call to end

//   let maximumDuration = null
//   maximumDuration = worker.maximumDuration

//   worker.maximumDuration = 1
//   await test.throwsAsync(worker.exit(), { 'instanceOf': WorkerClientDurationExceededError })
//   worker.maximumDuration = maximumDuration

// })

// Test.skip('WorkerClient.disconnect() ...', async (test) => {

//   let worker = new WorkerClient()

//   await test.notThrowsAsync(worker.ping()) // establishes is ready
//   await worker.disconnect()
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })

// Test.skip('WorkerClient.exit()', async (test) => {

//   let worker = new WorkerClient() // LoggedClient() // 

//   // this import is required because it contains the onEnd method
//   await worker.import(Require.resolve('./worker.js'))

//   await worker.exit({ 'pid': worker.pid }) // also establishes is ready
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })

// Test.skip('WorkerClient.uncaughtException()', async (test) => {

//   let worker = new WorkerClient()

//   await worker.uncaughtException() // also establishes is ready
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })
 
// Test.skip('WorkerClient.unhandledRejection()', async (test) => {

//   // this test requires that unhandled promises exit the node process
//   // this is enabled by the --unhandled-rejections=strict argument

//   let worker = new WorkerClient()

//   await worker.unhandledRejection() // also establishes is ready
//   await test.throwsAsync(worker.ping(), { 'code': 'ERR_IPC_CHANNEL_CLOSED' })

// })
