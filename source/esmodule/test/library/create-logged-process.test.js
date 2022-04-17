import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { CreateRandomId, ForkedProcess, SpawnedProcess, WorkerClient } from '@virtualpatterns/mablung-worker'
import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'
import FileSystem from 'fs-extra'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test('CreateLoggedProcess(ForkedProcess)', (test) => {
  return test.notThrowsAsync(async () => { 

    let id = await CreateRandomId()
    let logPath = Path.resolve(DataPath, `${id}.log`)

    const LoggedForkedProcess = CreateLoggedProcess(ForkedProcess)

    let process = new LoggedForkedProcess(logPath, Path.resolve(FolderPath, './resource/forked.js'))

    test.assert(process instanceof ForkedProcess)

    await process.whenExit()

  })
})

Test('CreateLoggedProcess(SpawnedProcess)', (test) => {
  return test.notThrowsAsync(async () => { 

    let id = await CreateRandomId()
    let logPath = Path.resolve(DataPath, `${id}.log`)

    const LoggedSpawnedProcess = CreateLoggedProcess(SpawnedProcess)

    let process = new LoggedSpawnedProcess(logPath, Process.env.MAKE_PATH, { 'version': true })

    test.assert(process instanceof SpawnedProcess)

    await process.whenExit()

  })
})

Test('CreateLoggedProcess(WorkerClient)', (test) => {
  return test.notThrowsAsync(async () => { 

    let id = await CreateRandomId()
    let logPath = Path.resolve(DataPath, `${id}.log`)

    const LoggedWorkerClient = CreateLoggedProcess(WorkerClient)

    let client = new LoggedWorkerClient(logPath, Path.resolve(FolderPath, './worker/worker.js'))

    await client.whenReady()

    try {
      test.assert(client instanceof WorkerClient)
    } finally {
      await client.exit()
    }

  })
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
