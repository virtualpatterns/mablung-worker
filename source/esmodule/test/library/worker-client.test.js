import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { WorkerClient } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateMessageId } from '../../library/create-message-id.js'

const FilePath = __filePath
const Require = __require

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const WorkerPath = Require.resolve('./worker/worker-client.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.serial('WorkerClient(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {

    let client = new LoggedClient(WorkerPath)

    await client.whenReady()

    try {
      test.deepEqual(client.argument, [])
      test.deepEqual(client.option, {
        'serialization': 'advanced',
        'stdio': 'pipe',
        'maximumDuration': 5000
      })
    } finally {
      await client.exit()
    }

  })
})

Test.serial('WorkerClient(\'...\', { ... })', (test) => {
  return test.notThrowsAsync(async () => {
    
    let client = new LoggedClient(WorkerPath, { '--asd': 'fgh' })

    await client.whenReady()

    try {
      test.deepEqual(client.argument, [
        '--asd',
        'fgh'
      ])
      test.deepEqual(client.option, {
        'serialization': 'advanced',
        'stdio': 'pipe',
        'maximumDuration': 5000
      })
    } finally {
      await client.exit()
    }

  })
})

Test.serial('WorkerClient(\'...\', { ... }, { ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let client = new LoggedClient(WorkerPath, { '--asd': 'fgh' }, { 'maximumDuration': 10000 })

    await client.whenReady()

    try {
      test.deepEqual(client.argument, [
        '--asd',
        'fgh'
      ])
      test.deepEqual(client.option, {
        'serialization': 'advanced',
        'stdio': 'pipe',
        'maximumDuration': 10000
      })
    } finally {
      await client.exit()
    }

  })
})

Test.serial('maximumDuration', async (test) => {

  let maximumDuration = 10000

  let client = new LoggedClient(WorkerPath, {}, { 'maximumDuration': maximumDuration })

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

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    let ping = await client.ping()
    test.assert(ping.cpuUsage > 0)
  } finally {
    await client.exit()
  }

  await new Promise((resolve) => setTimeout(resolve, 5000))

})

Test.serial('ping() throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

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

  let client = new LoggedClient(WorkerPath)

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

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.exit())

})

Test.serial('exit(...)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  await test.notThrowsAsync(async () => {
    let [ code ] = await client.exit(1)
    test.is(code, 1)
  })

})

Test.serial('exit(...) on send(\'...\')', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  await test.notThrowsAsync(async () => {
    let [ code ] = await Promise.all([ client.whenExit(), client.send('SIGHUP') ])
    test.is(code, 42)
  })

})

Test.serial('kill()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.kill())

})

Test.serial('kill(\'...\')', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.kill('SIGINT'))

})
