import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateLoggedProcess, ChildProcess, WorkerClient } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const Require = __require
const WorkerPath = Require.resolve('./worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('onSpawn() throws Error', async (test) => {

  let onSpawnStub = Sinon
    .stub(ChildProcess.prototype, 'onSpawn')
    .throws(new Error())

  try {

    let client = new LoggedClient(WorkerPath)

    let [ , , error ] = await client.whenEvent('error')

    test.assert(error instanceof Error)
    await client.kill()

  } finally {
    onSpawnStub.restore()
  }

})

Test.serial('onMessage() throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {

    let onMessageStub = Sinon
      .stub(client, 'onMessage')
      .throws(new Error())

    try {
      await test.notThrowsAsync(Promise.all([ client.whenEvent('error'), client.process.emit('message', {}) ]))
    } finally {
      onMessageStub.restore()
    }

  } finally {
    await client.exit()
  }

})

Test.serial('onExit() throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {

    let onExitStub = Sinon
      .stub(client, 'onExit')
      .throws(new Error())

    try {
      await test.notThrowsAsync(Promise.all([ client.whenEvent('error'), client.process.emit('exit', null, null) ]))
    } finally {
      onExitStub.restore()
    }

  } finally {
    await client.exit()
  }

})

// Test.serial('onError() throws Error', async (test) => {

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
