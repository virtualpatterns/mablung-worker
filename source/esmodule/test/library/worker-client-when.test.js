import { ChildProcessDurationExceededError, ChildProcessExitedError, ChildProcessKilledError } from '@virtualpatterns/mablung-worker'
import { CreateRandomId, LoggedWorkerClient } from '@virtualpatterns/mablung-worker/test'
import { Is } from '@virtualpatterns/mablung-is'
import { Path } from '@virtualpatterns/mablung-path'
import FileSystem from 'fs-extra'
import Test from 'ava'

const FilePath = __filePath
const FolderPath = Path.dirname(FilePath)

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')
const WorkerPath = Path.resolve(FolderPath, './worker/worker.js')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.context.logPath = logPath

})

Test('whenReady()', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await test.notThrowsAsync(client.whenReady())
  await client.exit()

})

Test('whenSpawn()', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenSpawn(), client.process.emit('spawn') ]))
  } finally {
    await client.exit()
  }

})

Test('whenSpawn() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenSpawn(), client.process.emit('error', new Error()) ]), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('whenSpawn() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenSpawn(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test('whenMessage()', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenMessage(), client.process.emit('message', {}) ]))
  } finally {
    await client.exit()
  }

})

Test('whenMessage(...)', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenMessage((message) => message.id === '123'), client.process.emit('message', { 'id': '123' }) ]))
  } finally {
    await client.exit()
  }

})

Test('whenMessage() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test('whenMessage() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test('whenMessage() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test('whenMessage() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('error', new Error()) ]), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('whenMessage() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenMessage((message) => Is.not.equal(message.type, 'ready')), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test('whenOutput()', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenOutput(), client.process.stdout.emit('data', `${Path.relative('', WorkerPath)}\n`) ]))
  } finally {
    await client.exit()
  }

})

Test('whenOutput(...)', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenOutput((data) => /worker\.c?js/im.test(data)), client.process.stdout.emit('data', `${Path.relative('', WorkerPath)}\n`) ]))
  } finally {
    await client.exit()
  }

})

Test('whenOutput() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenOutput(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test('whenOutput() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenOutput(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test('whenOutput() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenOutput(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test('whenOutput() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenOutput(), client.process.emit('error', new Error()) ]), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('whenOutput(...) throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenOutput((data) => /worker\.c?js/im.test(data)), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test('whenExit() code=0', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', 0, null) ]))
  } finally {
    await client.exit()
  }

})

Test('whenExit() code=null', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', null, null) ]))
  } finally {
    await client.exit()
  }

})

Test('whenExit() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test('whenExit() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenExit(), client.process.emit('error', new Error()) ]), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('whenExit() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenExit(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test('whenKill()', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', null, 'SIGINT') ]))
  } finally {
    await client.exit()
  }

})

Test('whenKill() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test('whenKill() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test('whenKill() throws Error', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('error', new Error()) ]), { 'instanceOf': Error })
  } finally {
    await client.exit()
  }

})

Test('whenKill() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenKill(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test('whenError()', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenError(), client.process.emit('error', new Error()) ]))
  } finally {
    await client.exit()
  }

})

// Test('whenError() throws ChildProcessExitedError code=0', async (test) => {

//   let id = await CreateRandomId()
//   let logPath = Path.resolve(DataPath, `${id}.log`)

//   let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

//   await client.whenReady()

//   try {
//     await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
//   } finally {
//     await client.exit()
//   }

// })

// Test('whenError() throws ChildProcessExitedError code=null', async (test) => {

//   let id = await CreateRandomId()
//   let logPath = Path.resolve(DataPath, `${id}.log`)

//   let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

//   await client.whenReady()

//   try {
//     await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
//   } finally {
//     await client.exit()
//   }

// })

// Test('whenError() throws ChildProcessKilledError', async (test) => {

//   let id = await CreateRandomId()
//   let logPath = Path.resolve(DataPath, `${id}.log`)

//   let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

//   await client.whenReady()

//   try {
//     await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
//   } finally {
//     await client.exit()
//   }

// })

Test('whenError() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenError(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test('whenEvent()', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenEvent({ 'emitter': client.process, 'name': 'exit' }, 1000), client.process.emit('exit', 0, null) ]))
  } finally {
    await client.exit()
  }

})

Test('whenEvent() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedWorkerClient(test.context.logPath, WorkerPath)

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenEvent({ 'emitter': client.process, 'name': 'exit' } , 1000), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})
