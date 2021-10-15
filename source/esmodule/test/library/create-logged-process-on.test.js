import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const Require = __require
const WorkerPath = Require.resolve('./worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('onLogOpen() throws Error', async (test) => {

  let onLogOpenStub = Sinon
    .stub(LoggedClient.prototype, 'onLogOpen')
    .throws(new Error())
  
  try {

    let client = new LoggedClient(WorkerPath)

    let [ , , error ] = await client.whenLogEvent('error')

    test.assert(error instanceof Error)
    await client.kill()

  } finally {
    onLogOpenStub.restore()
  }

})

Test.serial('onLogClose() throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {

    let onLogCloseStub = Sinon
      .stub(client, 'onLogClose')
      .throws(new Error())

    try {
      await test.notThrowsAsync(Promise.all([ client.whenLogEvent('error'), client.stream.emit('close') ]))
    } finally {
      onLogCloseStub.restore()
    }

  } finally {
    await client.exit()
  }

})
