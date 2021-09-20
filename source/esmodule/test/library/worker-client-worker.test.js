import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'
import { CreateMessageId } from '../../library/create-message-id.js'

import { ChildProcessDurationExceededError, ChildProcessExitedError, ChildProcessKilledError } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClass = CreateLoggedProcess(WorkerClient, LogPath)
const WorkerPath = FilePath.replace('worker-', 'worker/worker-').replace('.test', '')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('then', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    test.is(client.worker.then, undefined)
  } finally {
    await client.exit()
  }

})

Test.serial('invalidProperty()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.invalidProperty(), { 'message': 'The property \'invalidProperty\' is invalid.' })
  } finally {
    await client.exit()
  }
  
})

Test.serial('doIt()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.doIt())
  } finally {
    await client.exit()
  }
  
})

Test.serial('doIt() throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateMessageId(),
        'type': 'call',
        'name': 'doIt',
        'argument': [],
        'error': new Error()
      })

    try {
      await test.throwsAsync(client.worker.doIt(), { 'instanceOf': Error })
    } finally {
      sendStub.restore()
    }

  } finally {
    await client.exit()
  }

})

Test.serial('doIt(...)', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.doIt(1000))
  } finally {
    await client.exit()
  }
  
})

Test.serial('doIt(...) throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {

    let maximumDuration = null
    maximumDuration = client.maximumDuration

    client.maximumDuration = 1000
    await test.throwsAsync(client.worker.doIt(2500), { 'instanceOf': ChildProcessDurationExceededError })
    client.maximumDuration = maximumDuration

  } finally {
    await client.exit()
  }

})

Test.serial('doIt(...) throws ChildProcessExitedError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.doIt(1000), client.exit() ]), { 'instanceOf': ChildProcessExitedError })

})

Test.serial('doIt(...) throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.doIt(1000), client.kill() ]), { 'instanceOf': ChildProcessKilledError })

})

Test.serial('getPid()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    test.is(await client.worker.getPid(), client.pid)
  } finally {
    await client.exit()
  }
  
})

Test.serial('getPid() throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateMessageId(),
        'type': 'call',
        'name': 'getPid',
        'argument': [],
        'error': new Error()
      })

    try {
      await test.throwsAsync(client.worker.getPid(), { 'instanceOf': Error })
    } finally {
      sendStub.restore()
    }

  } finally {
    await client.exit()
  }

})

Test.serial('getPid(...)', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    test.is(await client.worker.getPid(1000), client.pid)
  } finally {
    await client.exit()
  }
  
})

Test.serial('getPid(...) throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {

    let maximumDuration = null
    maximumDuration = client.maximumDuration

    client.maximumDuration = 1000
    await test.throwsAsync(client.worker.getPid(2500), { 'instanceOf': ChildProcessDurationExceededError })
    client.maximumDuration = maximumDuration

  } finally {
    await client.exit()
  }

})

Test.serial('getPid(...) throws ChildProcessExitedError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.getPid(2500), client.exit() ]), { 'instanceOf': ChildProcessExitedError })

})

Test.serial('getPid(...) throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.getPid(2500), client.kill() ]), { 'instanceOf': ChildProcessKilledError })

})

Test.serial('throwException() throws WorkerExceptionError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.throwException(), { 'message': 'WorkerExceptionError' })
  } finally {
    await client.exit()
  }

})

Test.serial('throwUncaughtException()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(Promise.all([ client.whenExit(), client.worker.throwUncaughtException() ]))

})

Test.serial('rejectUnhandledException()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.rejectUnhandledException())
  } finally {
    await client.exit()
  }

})
