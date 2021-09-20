import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'
import { CreateMessageId } from '../../library/create-message-id.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClass = CreateLoggedProcess(WorkerClient, LogPath)
const Require = __require
const WorkerPath = Require.resolve('./worker/empty-object.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('WorkerClient()', (test) => {
  return test.throws(() => { new LoggedClass() }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('WorkerClient(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {

    let client = new LoggedClass(WorkerPath)
    await client.whenReady()

    test.deepEqual(client.argument, [])
    test.deepEqual(client.option, {
      'serialization': 'advanced',
      'stdio': 'pipe',
      'maximumDuration': 5000
    })

    await client.exit()

  })
})

Test.serial('WorkerClient(\'...\', { ... })', (test) => {
  return test.notThrowsAsync(async () => {
    
    let client = new LoggedClass(WorkerPath, { '--asd': 'fgh' })
    await client.whenReady()

    test.deepEqual(client.argument, [
      '--asd',
      'fgh'
    ])
    test.deepEqual(client.option, {
      'serialization': 'advanced',
      'stdio': 'pipe',
      'maximumDuration': 5000
    })

    await client.exit()

  })
})

Test.serial('WorkerClient(\'...\', { ... }, { ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let client = new LoggedClass(WorkerPath, { '--asd': 'fgh' }, { 'maximumDuration': 10000 })
    await client.whenReady()

    test.deepEqual(client.argument, [
      '--asd',
      'fgh'
    ])
    test.deepEqual(client.option, {
      'serialization': 'advanced',
      'stdio': 'pipe',
      'maximumDuration': 10000
    })

    await client.exit()

  })
})

Test.serial('maximumDuration', async (test) => {

  let maximumDuration = 10000
  let client = new LoggedClass(WorkerPath, {}, { 'maximumDuration': maximumDuration })

  await client.whenReady()

  try {

    test.is(client.maximumDuration, maximumDuration)
    test.is(client.option.maximumDuration, maximumDuration)

    client.maximumDuration = maximumDuration = 5000

    test.is(client.maximumDuration, maximumDuration)
    test.is(client.option.maximumDuration, maximumDuration)

  } finally {
    await client.exit()
  }

})

Test.serial('ping()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {

    let ping = await client.ping()
    test.assert(ping.cpuUsage > 0)

  } finally {
    await client.exit()
  }

})

Test.serial('ping() throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateMessageId(),
        'type': 'ping',
        'error': new Error()
      })

    try {
      await test.throwsAsync(client.ping(), { 'instanceOf': Error })
    } finally {
      sendStub.restore()
    }

  } finally {
    await client.exit()
  }

})

Test.serial('ping() returns undefined', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateMessageId(),
        'type': 'ping'
      })

    try {
      test.is(await client.ping(), undefined)
    } finally {
      sendStub.restore()
    }

  } finally {
    await client.exit()
  }

})

Test.serial('exit()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.exit())

})

Test.serial('kill()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.kill())

})
