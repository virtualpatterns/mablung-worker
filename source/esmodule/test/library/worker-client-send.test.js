import { ChildProcessSignalError } from '@virtualpatterns/mablung-worker'
import { CreateRandomId, LoggedWorkerClient } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import FileSystem from 'fs-extra'
import Sinon from 'sinon'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')
const WorkerPath = Path.resolve(FolderPath, './worker/worker.js')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.context.logPath = logPath

})

Test('send(\'...\')', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.send('SIGINT'))
  await client.whenKill()

})

Test('send({ ... }, false)', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.send({ 'type': 'exit', 'code': 0 }, false))
  await client.whenExit()

})

Test('send({ ... }, true)', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.send({ 'type': 'ping' }, true))
    test.not(await client.send({ 'type': 'ping' }, true), undefined)
  } finally {
    await client.exit()
  }

})

Test('send({ id, ... }, false)', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.send({ 'id': '123', 'type': 'exit', 'code': 0 }, false))
  await client.whenExit()

})

Test('send({ id, ... }, true)', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.send({ 'id': '123', 'type': 'ping' }, true))
    test.not(await client.send({ 'id': '123', 'type': 'ping' }, true), undefined)
  } finally {
    await client.exit()
  }

})

Test('send({ \'type\' }, false)', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    test.is(await client.send({ 'type': 'type' }, false), undefined)
  } finally {
    await client.exit()
  }

})

Test('send({ \'type\' }, true) returns { \'The message with type \'type\' is invalid.\' }', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {

    let requestMessage = { 'type': 'type' }
    let responseMessage = await client.send(requestMessage, true)

    test.is(responseMessage.error.message, 'The message with type \'type\' is invalid.')

  } finally {
    await client.exit()
  }

})

Test('send({}) throws \'The message with type undefined is invalid.\'', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {

    let requestMessage = {}
    let responseMessage = await client.send(requestMessage)

    test.is(responseMessage.error.message, 'The message with type undefined is invalid.')

  } finally {
    await client.exit()
  }

})

Test('send(\'...\') throws ChildProcessSignalError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {

    let killStub = Sinon
      .stub(client.process, 'kill')
      .returns(false)

    try {
      await test.throwsAsync(client.send('SIGINT'), { 'instanceOf': ChildProcessSignalError })
    } finally {
      killStub.restore()
    }

  } finally {
    await client.exit()
  }

})

Test('send({ ... }) throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client.process, 'send')
      .callsArgWith(1, new Error())

    try {
      await test.throwsAsync(client.send({}), { 'instanceOf': Error })
    } finally {
      sendStub.restore()
    }

  } finally {
    await client.exit()
  }

})
