import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { WorkerClient } from '@virtualpatterns/mablung-worker'
import { Path } from '@virtualpatterns/mablung-path'
import FileSystem from 'fs-extra'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateRandomId } from '../../library/create-random-id.js'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const WorkerPath = Path.resolve(FolderPath, './worker/worker-client.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test('WorkerClient(\'...\')', (test) => {
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

Test('WorkerClient(\'...\', { ... })', (test) => {
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

Test('WorkerClient(\'...\', { ... }, { ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let client = new LoggedClient(WorkerPath, { '--asd': 'fgh' }, { 'maximumDuration': 5000 })

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

Test('maximumDuration', async (test) => {

  let maximumDuration = 5000

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

Test('ping()', async (test) => {

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

Test('ping() throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateRandomId(),
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

Test('ping() returns undefined', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {

    let sendStub = Sinon
      .stub(client, 'send')
      .resolves({
        'id': await CreateRandomId(),
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

Test('exit()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.exit())

})

Test('exit(...)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  await test.notThrowsAsync(async () => {
    let [ code ] = await client.exit(1)
    test.is(code, 1)
  })

})

Test('exit(...) on send(\'...\')', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  await test.notThrowsAsync(async () => {
    let [ code ] = await Promise.all([ client.whenExit(), client.send('SIGHUP') ])
    test.is(code, 42)
  })

})

Test('kill()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.kill())

})

Test('kill(\'...\')', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()
  await test.notThrowsAsync(client.kill('SIGINT'))

})
