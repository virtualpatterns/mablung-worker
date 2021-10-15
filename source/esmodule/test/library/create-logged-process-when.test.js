import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'

import { ChildProcessDurationExceededError } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const Require = __require
const WorkerPath = Require.resolve('./worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('whenLogOpen()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenLogOpen(), client.stream.emit('open') ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenLogOpen() throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenLogOpen(), client.stream.emit('error', new Error()) ]), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test.serial('whenLogOpen() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenLogOpen(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenLogClose()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenLogClose(), client.stream.emit('close') ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenLogClose() throws Error', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenLogClose(), client.stream.emit('error', new Error()) ]), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test.serial('whenLogClose() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenLogClose(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenLogError()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenLogError(), client.stream.emit('error', new Error()) ]))
  } finally {
    await client.exit()
  }

})
