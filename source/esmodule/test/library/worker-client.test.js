import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, WorkerClient } from '../../index.js'

import { ChildProcessDurationExceededError, ChildProcessExitedError, ChildProcessInternalError, ChildProcessKilledError } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.c?js$/, '.log')
const Require = __require

const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('WorkerClient()', (test) => {
  return test.throws(() => {
    new LoggedClient()
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('WorkerClient(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {

    let client = new LoggedClient(Require.resolve('./worker.js'))
    await client.whenReady()
    await client.whenReady()
    await client.exit()

  })
})

Test.serial('WorkerClient(\'...\', { ... })', (test) => {
  return test.notThrowsAsync(async () => {
    
    let client = new LoggedClient(Require.resolve('./worker.js'), { '--asd': 'fgh' })
    await client.whenReady()
    await client.whenReady()
    await client.exit()

  })
})

Test.serial('WorkerClient(\'...\', { ... }, { ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let client = new LoggedClient(Require.resolve('./worker.js'), { '--asd': 'fgh' }, { 'maximumDuration': 10000 })
    await client.whenReady()
    await client.whenReady()
    await client.exit()

  })
})

Test.serial('maximumDuration', async (test) => {

  let maximumDuration = 10000
  let client = new LoggedClient(Require.resolve('./worker.js'), {}, { 'maximumDuration': maximumDuration })

  await client.whenReady()

  try {

    test.is(client.maximumDuration, maximumDuration)
    test.is(client.option.maximumDuration, maximumDuration)

    client.maximumDuration = maximumDuration = 5000

    test.is(client.maximumDuration, maximumDuration)
    test.is(client.option.maximumDuration, maximumDuration)

  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage()', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenMessage(), client.process.emit('message', {}) ]))
  } finally {
    await client.exit()
  }

})
 
Test.serial('whenMessage(...)', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenMessage((message) => message.id === '123'), client.process.emit('message', { 'id': '123' }) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessInternalError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenMessage(), client.process.emit('error', new Error()) ]), { 'instanceOf': ChildProcessInternalError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenMessage() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenMessage(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() code=0', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([client.whenExit(), client.process.emit('exit', 0, null) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() code=null', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', null, null) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenExit(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() throws ChildProcessInternalError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenExit(), client.process.emit('error', new Error()) ]), { 'instanceOf': ChildProcessInternalError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenExit() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenExit(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill()', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', null, 'SIGINT') ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessInternalError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenKill(), client.process.emit('error', new Error()) ]), { 'instanceOf': ChildProcessInternalError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenKill() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenKill(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError()', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenError(), client.process.emit('error', new Error()) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessExitedError code=0', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', 0, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessExitedError code=null', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', null, null) ]), { 'instanceOf': ChildProcessExitedError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(Promise.all([ client.whenError(), client.process.emit('exit', null, 'SIGINT') ]), { 'instanceOf': ChildProcessKilledError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenError() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenError(), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('whenEvent()', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(Promise.all([ client.whenEvent('exit', 1000), client.process.emit('exit', 0, null) ]))
  } finally {
    await client.exit()
  }

})

Test.serial('whenEvent() throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.whenEvent('exit', 1000), { 'instanceOf': ChildProcessDurationExceededError })
  } finally {
    await client.exit()
  }

})

Test.serial('ping()', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.ping())
  } finally {
    await client.exit()
  }

})

Test.serial('exit() throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.exit(), client.kill() ]), { 'instanceOf': ChildProcessKilledError })

})

Test.serial('kill()', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()
  await test.notThrowsAsync(client.kill())

})

Test.serial('send({ ... }) throws \'The message with type \'type\' is invalid.\'', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.send({ 'type': 'type' }), { 'message': 'The message with type \'type\' is invalid.' })
  } finally {
    await client.exit()
  }

})

Test.serial('send({ ... }) throws \'The message with type undefined is invalid.\'', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.send({}), { 'message': 'The message with type undefined is invalid.' })
  } finally {
    await client.exit()
  }

})

Test.serial('worker.then', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    test.falsy(client.worker.then)
  } finally {
    await client.exit()
  }

})

Test.serial('worker.getPid()', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    test.is(await client.worker.getPid(), client.pid)
  } finally {
    await client.exit()
  }
  
})

Test.serial('worker.getPid(...) throws ChildProcessDurationExceededError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {

    let maximumDuration = null
    maximumDuration = client.maximumDuration

    client.maximumDuration = 1000
    await test.throwsAsync(client.worker.getPid(2500), { 'instanceOf': ChildProcessDurationExceededError })
    client.maximumDuration = maximumDuration

  } finally {
    await client.exit()
  }

})

Test.serial('worker.getPid(...) throws ChildProcessExitedError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.getPid(2500), client.exit() ]), { 'instanceOf': ChildProcessExitedError })

})

Test.serial('worker.getPid(...) throws ChildProcessKilledError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()
  await test.throwsAsync(Promise.all([ client.worker.getPid(2500), client.kill() ]), { 'instanceOf': ChildProcessKilledError })

})

Test.serial('worker.throwException() throws WorkerExceptionError', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.throwsAsync(client.worker.throwException(), { 'message': 'WorkerExceptionError' })
  } finally {
    await client.exit()
  }

})

Test.serial('worker.throwUncaughtException() ...', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.throwUncaughtException())
  } finally {
    await client.exit()
  }

})

Test.serial('worker.rejectUnhandledException() ...', async (test) => {

  let client = new LoggedClient(Require.resolve('./worker.js'))

  await client.whenReady()

  try {
    await test.notThrowsAsync(client.worker.rejectUnhandledException())
  } finally {
    await client.exit()
  }

})
