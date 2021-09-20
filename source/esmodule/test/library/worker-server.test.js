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

// Test.serial('stop()', async (test) => {

//   let client = new LoggedClass(WorkerPath)

//   await client.whenReady()

//   try {
//     await test.notThrowsAsync(client.worker.stop())
//   } finally {
//     await client.exit()
//   }

// })

Test.serial('onError(...)', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    test.assert(await client.worker.onError())
  } finally {
    await client.exit()
  }

})
