import { CreateRandomId } from '@virtualpatterns/mablung-worker'
import { LoggedWorkerClient } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import FileSystem from 'fs-extra'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')
const WorkerPath = Path.resolve(FolderPath, './worker/worker-server-send.js')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test('send()', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.send())
  } finally {
    await client.exit()
  }

})

Test('send({ ... }) throws Error', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.sendThrowsError(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('send({ ... }) throws WorkerServerNoIPCChannelError', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  let client = new LoggedWorkerClient(logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.sendThrowsWorkerServerNoIPCChannelError(), { 'message': 'The server has no IPC channel.' })
  } finally {
    await client.exit()
  }

})
