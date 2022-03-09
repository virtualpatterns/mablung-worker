import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import { WorkerClient } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Sinon from 'sinon'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const WorkerPath = Path.resolve(FolderPath, './worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test('onSpawn() throws Error', async (test) => {

  let client = new (CreateLoggedProcess(WorkerClient, LogPath))(WorkerPath)

  try {

    let error = new Error()
    let onSpawnStub = Sinon
      .stub(client, 'onSpawn')
      .throws(error)

    try {
      await test.throwsAsync(client.whenSpawn(), { 'is': error })
    } finally {
      onSpawnStub.restore()
    }

  } finally {
    await client.kill()
  }

})

Test('onMessage() throws Error', async (test) => {

  let client = new (CreateLoggedProcess(WorkerClient, LogPath))(WorkerPath)

  try {

    let error = new Error()
    let onMessageStub = Sinon
      .stub(client, 'onMessage')
      .throws(error)

    try {
      await test.throwsAsync(client.whenMessage(), { 'is': error })
    } finally {
      onMessageStub.restore()
    }

  } finally {
    await client.kill()
  }

})

Test('onExit() throws Error', async (test) => {

  let client = new (CreateLoggedProcess(WorkerClient, LogPath))(WorkerPath)

  await client.whenReady()

  let error = new Error()
  let onExitStub = Sinon
    .stub(client, 'onExit')
    .throws(error)

  try {
    await test.throwsAsync(client.exit(), { 'is': error })
  } finally {
    onExitStub.restore()
  }

})

Test('onKill() throws Error', async (test) => {

  let client = new (CreateLoggedProcess(WorkerClient, LogPath))(WorkerPath)

  await client.whenReady()

  let error = new Error()
  let onKillStub = Sinon
    .stub(client, 'onKill')
    .throws(error)

  try {
    await test.throwsAsync(client.kill(), { 'is': error })
  } finally {
    onKillStub.restore()
  }

})

// Test('onError() throws Error', async (test) => {

//   let client = new LoggedClient(WorkerPath)

//   await client.whenReady()

//   try {

//     let error = new Error()
//     let onErrorStub = Sinon
//       .stub(client, 'onError')
//       .throws(error)

//     try {

//       let errorStub = Sinon
//         .stub(console, 'error')

//       try {

//         client.process.emit('error')
//         test.true(errorStub.calledWith(error))

//       } finally {
//         errorStub.restore()
//       }

//     } finally {
//       onErrorStub.restore()
//     }

//   } finally {
//     await client.exit()
//   }

// })
