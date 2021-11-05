import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { SpawnedProcess, WorkerClient } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

const FilePath = __filePath
const Process = process
const Require = __require

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const WorkerPath = Require.resolve('./worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('CreateLoggedProcess(SpawnedProcess, \'...\')', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, LogPath) })
})

Test.serial('CreateLoggedProcess(SpawnedProcess, \'...\', { ... }, { ... })', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, LogPath, {}, {}) })
})

Test.serial('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\')', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH)
  return test.notThrowsAsync(process.whenExit())
})

Test.serial('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\', { ... }, { ... })', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH, {
    '--annabelle': 'bernadette',
    '--benjamin': 'claudius',
    '--claudette': 'danaldus'
  }, {
    '--annabelle': 'bernadette'
  })
  return test.notThrowsAsync(process.whenExit())
})

Test.serial('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\') on kill', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH)
  return test.notThrowsAsync(Promise.all([ process.whenKill(), process.send('SIGINT') ]))
})

Test.serial('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\') on error', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))('invalid')
  return test.notThrowsAsync(process.whenError())
})

Test.serial('CreateLoggedProcess(WorkerClient, \'...\')(\'...\')', async (test) => {

  let client = new (CreateLoggedProcess(WorkerClient, LogPath))(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.ping())
  } finally {
    await client.exit()
  }

})
