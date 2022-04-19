import { CreateRandomId, LoggedWorkerClient } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import FileSystem from 'fs-extra'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')
const WorkerPath = Path.resolve(FolderPath, './worker/worker-server-on.js')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.context.logPath = logPath

})

Test('onInterval() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onInterval(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('onMessage(...) throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onMessage(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('onBeforeExit() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onBeforeExit(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('onExit() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onExit(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('onError(...) throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onError(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})
