import { CreateRandomId } from '@virtualpatterns/mablung-worker'
import { LoggedSpawnedProcess } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'
import FileSystem from 'fs-extra'

const FilePath = __filePath
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test('LoggedProcess()', (test) => {
  test.throws(() => { new LoggedSpawnedProcess() }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test('LoggedProcess(\'...\', \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, Process.env.MAKE_PATH).whenExit())

})

Test('LoggedProcess(\'...\', \'...\', { ... }, { ... })', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, Process.env.MAKE_PATH, {
      '--annabelle': 'bernadette',
      '--benjamin': 'claudius',
      '--claudette': 'danaldus'
    }, {
      '--annabelle': 'bernadette'
    }).whenExit())

})

Test('LoggedProcess(\'...\', { ... }, \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, {}, Process.env.MAKE_PATH).whenExit())

})

Test('LoggedProcess(\'...\', { ... }, { ... }, \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, {}, {}, Process.env.MAKE_PATH).whenExit())

})

Test('LoggedProcess(\'...\', { ... }, { ... }, { ... }, \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.throws(() => { new LoggedSpawnedProcess(logPath, {}, {}, {}, Process.env.MAKE_PATH) }, { 'code': 'ERR_INVALID_ARG_TYPE' })

})

// Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\', { ... })', (test) => {
//   let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH, {
//     '--annabelle': 'bernadette',
//     '--benjamin': 'claudius',
//     '--claudette': 'danaldus'
//   })
//   return test.notThrowsAsync(process.whenExit())
// })

// Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\', { ... }, { ... })', (test) => {
//   let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH, {
//     '--annabelle': 'bernadette',
//     '--benjamin': 'claudius',
//     '--claudette': 'danaldus'
//   }, {
//     '--annabelle': 'bernadette'
//   })
//   return test.notThrowsAsync(process.whenExit())
// })

// Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\') on kill', (test) => {
//   let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))(Process.env.MAKE_PATH)
//   return test.notThrowsAsync(Promise.all([ process.whenKill(), process.send('SIGINT') ]))
// })

// Test('CreateLoggedProcess(SpawnedProcess, \'...\')(\'...\') on error', (test) => {
//   let process = new (CreateLoggedProcess(SpawnedProcess, LogPath))('invalid')
//   return test.notThrowsAsync(process.whenError())
// })

// // Test('CreateLoggedProcess(WorkerClient, \'...\')(\'...\')', async (test) => {

// //   let client = new (CreateLoggedProcess(WorkerClient, LogPath))(WorkerPath)

// //   await client.whenReady()

// //   try {
// //     await test.notThrowsAsync(client.ping())
// //   } finally {
// //     await client.exit()
// //   }

// // })
