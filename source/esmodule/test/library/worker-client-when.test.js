import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'

import { ChildProcessDurationExceededError, ChildProcessExitedError, ChildProcessInternalError, ChildProcessKilledError } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const Require = __require
const WorkerPath = Require.resolve('./worker/worker.js')

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('whenReady()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await test.notThrowsAsync(client.whenReady())
  await client.exit()

})

Test.serial('whenSpawn()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenSpawn(), client.process.emit('spawn') ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenSpawn() throws ChildProcessInternalError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenSpawn(), client.process.emit('error', new Error()) ]), { 'instanceOf': ChildProcessInternalError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenSpawn() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenSpawn(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenMessage(), client.process.emit('message', {}) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage(...)', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenMessage((message) => message.id === '123'), client.process.emit('message', { 'id': '123' }) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessInternalError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('error', new Error()) ]), { 'instanceOf': ChildProcessInternalError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenMessage(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() code=0', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', 0, null) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() code=null', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', null, null) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() throws ChildProcessInternalError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenExit(), client.process.emit('error', new Error()) ]), { 'instanceOf': ChildProcessInternalError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenExit(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', null, 'SIGINT') ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessInternalError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('error', new Error()) ]), { 'instanceOf': ChildProcessInternalError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenKill(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenError(), client.process.emit('error', new Error()) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenError(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenEvent()', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenEvent('exit', 1000), client.process.emit('exit', 0, null) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenEvent() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenEvent('exit', 1000), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})
