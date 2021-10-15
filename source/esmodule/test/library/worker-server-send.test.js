import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const Require = __require
const WorkerPath = Require.resolve('./worker/worker-server-send.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('send()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.send())
  } finally {
    await client.exit()
  }

})

Test.serial('send({ ... }) throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.sendThrowsError(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test.serial('send({ ... }) throws WorkerServerNoIPCChannelError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.sendThrowsWorkerServerNoIPCChannelError(), { 'message': 'The server has no IPC channel.' })
  } finally {
    await client.exit()
  }

})
