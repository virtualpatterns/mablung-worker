import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { WorkerClient, ChildProcessSignalError } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

const FilePath = __filePath
const Require = __require

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const WorkerPath = Require.resolve('./worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.serial('send(\'...\')', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.send('SIGINT'))
  await client.whenKill()

})

Test.serial('send({ ... }, false)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.send({ 'type': 'exit', 'code': 0 }, false))
  await client.whenExit()

})

Test.serial('send({ ... }, true)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.send({ 'type': 'ping' }, true))
    test.not(await client.send({ 'type': 'ping' }, true), undefined)
  } finally {
    await client.exit()
  }

})

Test.serial('send({ id, ... }, false)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.send({ 'id': '123', 'type': 'exit', 'code': 0 }, false))
  await client.whenExit()

})

Test.serial('send({ id, ... }, true)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.send({ 'id': '123', 'type': 'ping' }, true))
    test.not(await client.send({ 'id': '123', 'type': 'ping' }, true), undefined)
  } finally {
    await client.exit()
  }

})

Test.serial('send({ \'type\' }, false)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    test.is(await client.send({ 'type': 'type' }, false), undefined)
  } finally {
    await client.exit()
  }

})

Test.serial('send({ \'type\' }, true) returns { \'The message with type \'type\' is invalid.\' }', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {

    let requestMessage = { 'type': 'type' }
    let responseMessage = await client.send(requestMessage, true)

    test.is(responseMessage.error.message, 'The message with type \'type\' is invalid.')

  } finally {
    await client.exit()
  }

})

Test.serial('send({}) throws \'The message with type undefined is invalid.\'', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {

    let requestMessage = {}
    let responseMessage = await client.send(requestMessage)

    test.is(responseMessage.error.message, 'The message with type undefined is invalid.')

  } finally {
    await client.exit()
  }

})

Test.serial('send(\'...\') throws ChildProcessSignalError', async (test) => {

  let client = new LoggedClient(WorkerPath)

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

Test.serial('send({ ... }) throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

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
