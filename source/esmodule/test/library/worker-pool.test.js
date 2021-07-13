import Sinon from 'sinon'
import Test from 'ava'

import { LoggedPool } from './logged-pool.js'
import { WorkerPool } from '../../index.js'

import { WorkerPoolDisconnectedError } from '../../index.js'

const Require = __require

Test('new WorkerPool()', async (test) => {

  let pool = null
  
  test.notThrows(() => { pool = new WorkerPool()})
  await test.notThrowsAsync(pool.exit())

})

Test('new WorkerPool({ \'maximumDuration\': N })', async (test) => {

  let longMaximumDuration = 15000
  let pool = new WorkerPool({ 'maximumDuration': longMaximumDuration})

  try {
    test.is(pool.maximumDuration, longMaximumDuration)
  } finally {
    await pool.exit()
  }

})

Test('WorkerPool.maximumDuration', async (test) => {

  let shortMaximumDuration = 5000
  let longMaximumDuration = 15000

  let pool = new WorkerPool()

  try {

    pool.maximumDuration = shortMaximumDuration
    test.is(pool.maximumDuration, shortMaximumDuration)
    pool.maximumDuration = longMaximumDuration

  } finally {
    await pool.exit()
  }

})

Test('WorkerPool._selectProcess(methodName, parameter)', async (test) => {

  const sandbox = Sinon.createSandbox()

  try {

    let pool = new WorkerPool(Require.resolve('./worker.js'))

    try {

      sandbox.spy(pool, '_selectProcess')

      await pool.module.getPid()

      test.true(pool._selectProcess.calledOnce)
      test.true(pool._selectProcess.calledWith('getPid', []))

    } finally {
      await pool.exit()
    }
  
  } finally {
    sandbox.restore()
  }

})

Test('WorkerPool.ping()', async (test) => {

  let pool = new WorkerPool()

  try {
    await test.notThrowsAsync(pool.ping())
  } finally {
    await pool.exit()
  }

})

Test('WorkerPool.ping() throws WorkerPoolDisconnectedError', async (test) => {

  let pool = new WorkerPool({ 'numberOfProcess': 1 })

  await pool.exit()
  await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerPoolDisconnectedError })

})

Test('WorkerPool.exit(option)', async (test) => {
  await test.notThrowsAsync((new WorkerPool()).exit())
})

Test('WorkerPool.exit(option) throws WorkerPoolDisconnectedError', async (test) => {

  let pool = new WorkerPool({ 'numberOfProcess': 1 })

  await pool.exit()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await test.throwsAsync(pool.exit(), { 'instanceOf': WorkerPoolDisconnectedError })

})

Test('WorkerPool.module.throwUncaughtException()', async (test) => {

  let pool = new WorkerPool(Require.resolve('./worker.js'), { 'numberOfProcess': 1 })

  try {
    await test.notThrowsAsync(pool.module.throwUncaughtException()) // the pool should recreate exited processes
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await test.notThrowsAsync(pool.ping())
  } finally {
    await pool.exit()
  }

})

Test('WorkerPool.module.rejectUnhandledException()', async (test) => {

  // this test requires that the node process exit when a Promise rejection is unhandled
  // as established by the --unhandled-rejections=strict parameter to node

  let pool = new WorkerPool(Require.resolve('./worker.js'), { 'numberOfProcess': 1 })

  try {
    await test.notThrowsAsync(pool.module.rejectUnhandledException()) // the pool should recreate exited processes
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await test.notThrowsAsync(pool.ping())
  } finally {
    await pool.exit()
  }

})

Test('WorkerPool.disconnect()', async (test) => {

  let pool = new WorkerPool({ 'numberOfProcess': 1 })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  await test.notThrowsAsync(pool.disconnect()) // disconnect causes a normal code = 0 exit, the pool will not recreate exited processes
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await test.throwsAsync(pool.ping(), { 'instanceOf': WorkerPoolDisconnectedError })

})

Test('WorkerPool.disconnect() throws WorkerPoolDisconnectedError', async (test) => {

  let pool = new WorkerPool({ 'numberOfProcess': 1 })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  await test.notThrowsAsync(pool.disconnect()) // disconnect causes a normal code = 0 exit, the pool will not recreate exited processes
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await test.throwsAsync(pool.disconnect(), { 'instanceOf': WorkerPoolDisconnectedError })

})

Test('WorkerPool.kill()', async (test) => {

  // use LoggedPool so that the if condition of _recreateProcess regarding the stream is called

  let pool = new LoggedPool({ 'numberOfProcess': 1 })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {

    await test.notThrowsAsync(pool.kill()) // the pool should recreate killed processes
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await test.notThrowsAsync(pool.ping())
  
  } finally {
    await pool.exit()
  }

})

Test('WorkerPool.kill() throws WorkerPoolDisconnectedError', async (test) => {

  let pool = new WorkerPool({ 'numberOfProcess': 1 })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  await test.notThrowsAsync(pool.disconnect()) // disconnect causes a normal code = 0 exit, the pool will not recreate exited processes
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await test.throwsAsync(pool.kill(), { 'instanceOf': WorkerPoolDisconnectedError })

})
