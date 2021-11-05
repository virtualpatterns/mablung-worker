import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { WorkerClient } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

const FilePath = __filePath
const Require = __require

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const WorkerPath = Require.resolve('./worker/worker-server-send.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
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
