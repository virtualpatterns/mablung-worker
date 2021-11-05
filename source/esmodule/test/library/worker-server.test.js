import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { WorkerClient } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

const FilePath = __filePath
const Require = __require

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedProcess = CreateLoggedProcess(WorkerClient, LogPath)
const WorkerPath = Require.resolve('./worker/worker-server.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test.serial('onError(...)', async (test) => {

  let client = new LoggedProcess(WorkerPath)

  await client.whenReady()

  try {
    test.assert(await client.worker.onError())
  } finally {
    await client.exit()
  }

})
