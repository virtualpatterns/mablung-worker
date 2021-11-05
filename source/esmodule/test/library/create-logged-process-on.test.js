import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { WorkerClient } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

const FilePath = __filePath
const Require = __require

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const WorkerPath = Require.resolve('./worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('onSpawn() throws Error', async (test) => {

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

Test.serial('onMessage() throws Error', async (test) => {

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

Test.serial('onExit() throws Error', async (test) => {

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

Test.serial('onKill() throws Error', async (test) => {

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

// Test.serial('onKill() throws Error', async (test) => {

//   let client = new LoggedClient(WorkerPath)

//   await client.whenReady()

//   try {

//     let onExitStub = Sinon
//       .stub(client, 'onExit')
//       .throws(new Error())

//     try {
//       await test.notThrowsAsync(Promise.all([ client.whenEvent('error'), client.process.emit('exit', null, null) ]))
//     } finally {
//       onExitStub.restore()
//     }

//   } finally {
//     await client.exit()
//   }

// })

// // Test.serial('onError() throws Error', async (test) => {

// //   let client = new LoggedClient(WorkerPath)

// //   await client.whenReady()

// //   try {

// //     let error = new Error()
// //     let onErrorStub = Sinon
// //       .stub(client, 'onError')
// //       .throws(error)

// //     try {

// //       let errorStub = Sinon
// //         .stub(console, 'error')

// //       try {

// //         client.process.emit('error')
// //         test.true(errorStub.calledWith(error))

// //       } finally {
// //         errorStub.restore()
// //       }

// //     } finally {
// //       onErrorStub.restore()
// //     }

// //   } finally {
// //     await client.exit()
// //   }

// // })
