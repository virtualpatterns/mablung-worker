import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import FileSystem from 'fs-extra'
import { Path } from '@virtualpatterns/mablung-path'
import { SpawnedProcess } from '@virtualpatterns/mablung-worker'
import Test from 'ava'

const FilePath = __filePath
const Process = process

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test('CreateLoggedProcess(SpawnedProcess, \'...\')', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, LogPath) })
})

Test('CreateLoggedProcess(SpawnedProcess, \'...\', { ... })', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, LogPath, {}) })
})

Test('CreateLoggedProcess(SpawnedProcess, \'...\', { ... }, { ... })', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, LogPath, {}, {}) })
})

// Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\')', (test) => {
//   let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH)
//   return test.notThrowsAsync(process.whenExit())
// })

Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\')', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH)
  return test.notThrowsAsync(process.whenExit())
})

Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\', { ... })', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH, {
    '--annabelle': 'bernadette',
    '--benjamin': 'claudius',
    '--claudette': 'danaldus'
  })
  return test.notThrowsAsync(process.whenExit())
})

Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\', { ... }, { ... })', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH, {
    '--annabelle': 'bernadette',
    '--benjamin': 'claudius',
    '--claudette': 'danaldus'
  }, {
    '--annabelle': 'bernadette'
  })
  return test.notThrowsAsync(process.whenExit())
})

Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\') on kill', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH)
  return test.notThrowsAsync(Promise.all([ process.whenKill(), process.send('SIGINT') ]))
})

Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\') on error', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))('invalid')
  return test.notThrowsAsync(process.whenError())
})

// Test('CreateLoggedProcess(WorkerClient, \'...\')(\'...\')', async (test) => {

//   let client = new (CreateLoggedProcess(WorkerClient, LogPath))(WorkerPath)

//   await client.whenReady()

//   try {
//     await test.notThrowsAsync(client.ping())
//   } finally {
//     await client.exit()
//   }

// })
