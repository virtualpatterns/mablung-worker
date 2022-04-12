import { ChildProcessDurationExceededError, ChildProcessExitedError, ChildProcessKilledError, CreateRandomId } from '@virtualpatterns/mablung-worker'
import { LoggedWorkerClient } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import FileSystem from 'fs-extra'
import Sinon from 'sinon'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')
const WorkerPath = Path.resolve(FolderPath, './worker/worker-client-worker.js')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test('then', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    test.is(client.worker.then, undefined)
  } finally {
    await client.exit()
  }

})

Test('invalidProperty()', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.invalidProperty(), { 'message': 'The property \'invalidProperty\' is invalid.' })
  } finally {
    await client.exit()
  }
  
})

Test('doIt()', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.doIt())
  } finally {
    await client.exit()
  }
  
})

Test('doIt() throws Error', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateRandomId(),
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

Test('doIt(...)', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.doIt(1000))
  } finally {
    await client.exit()
  }
  
})

Test('doIt(...) throws ChildProcessDurationExceededError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

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

Test('doIt(...) throws ChildProcessExitedError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.doIt(1000), client.exit(0, true) ]), { 'instanceOf': ChildProcessExitedError })

})

Test('doIt(...) throws ChildProcessKilledError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.doIt(1000), client.kill() ]), { 'instanceOf': ChildProcessKilledError })

})

Test('getPid()', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    test.is(await client.worker.getPid(), client.pid)
  } finally {
    await client.exit()
  }
  
})

Test('getPid() throws Error', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateRandomId(),
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

Test('getPid(...)', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    test.is(await client.worker.getPid(1000), client.pid)
  } finally {
    await client.exit()
  }
  
})

Test('getPid(...) throws ChildProcessDurationExceededError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

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

Test('getPid(...) throws ChildProcessExitedError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.getPid(2500), client.exit(0, true) ]), { 'instanceOf': ChildProcessExitedError })

})

Test('getPid(...) throws ChildProcessKilledError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.getPid(2500), client.kill() ]), { 'instanceOf': ChildProcessKilledError })

})

Test('throwException() throws WorkerExceptionError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.throwException(), { 'message': 'WorkerExceptionError' })
  } finally {
    await client.exit()
  }

})

Test('throwUncaughtException()', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(Promise.all([ client.whenExit(), client.worker.throwUncaughtException() ]))

})

Test('rejectUnhandledException()', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.rejectUnhandledException())
  } finally {
    await client.exit()
  }

})
