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

Test.serial('onInterval() throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onInterval(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test.serial('onMessage(...) throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onMessage(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test.serial('onExit() throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onExit(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test.serial('onError(...) throws Error', async (test) => {

  let client = new LoggedClass(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.onError(), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})
