import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClass = CreateLoggedProcess(WorkerClient, LogPath)
const WorkerPath = FilePath.replace('worker-', 'worker/worker-').replace('.test', '')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('send()', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.send())
  } finally {
    await client.exit()
  }

})

Test.serial('send({ ... }) throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.sendThrowsError(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test.serial('send({ ... }) throws WorkerServerNoIPCChannelError', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.sendThrowsWorkerServerNoIPCChannelError(), { 'message': 'The server has no IPC channel.' })
  } finally {
    await client.exit()
  }

})
