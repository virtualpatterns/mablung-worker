import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, ForkedProcess, SpawnedProcess } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.c?js$/, '.log')
const Process = process
const Require = __require

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('ForkedProcess()', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(ForkedProcess))()
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('ForkedProcess(\'...\')', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(ForkedProcess))(LogPath)
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('ForkedProcess(\'...\', { ... })', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(ForkedProcess))(LogPath, {})
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('ForkedProcess(\'...\', \'...\')', (test) => {
  return test.notThrowsAsync(() => {

    const LoggedProcess = CreateLoggedProcess(ForkedProcess)
    let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

    return Promise.all([ process.whenKill(), process.send('SIGINT') ])
    
  })
})

Test.serial('ForkedProcess(\'...\', { ... }, \'...\')', (test) => {
  return test.notThrowsAsync(() => {

    const LoggedProcess = CreateLoggedProcess(ForkedProcess)
    let process = new LoggedProcess(LogPath, {}, Require.resolve('./worker.js'))

    return Promise.all([ process.whenKill(), process.send('SIGINT') ])
    
  })
})

Test.serial('ForkedProcess(\'...\', \'...\', { ... })', (test) => {
  return test.notThrowsAsync(() => {

    const LoggedProcess = CreateLoggedProcess(ForkedProcess)
    let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'), {})

    return Promise.all([ process.whenKill(), process.send('SIGINT') ])
    
  })
})

Test.serial('ForkedProcess.onMessage({ ... })', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess)
  let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('message', {}))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])

})

Test.serial('ForkedProcess.onMessage(\'...\')', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess)
  let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('message', 'SIGINT'))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])

})

Test.serial('ForkedProcess.onExit(...)', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess)
  let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('exit', 0, null))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])

})

Test.serial('ForkedProcess.onKill(...)', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess)
  let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('exit', null, 'SIGINT'))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])
  
})

Test.serial('ForkedProcess.onError(...)', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess)
  let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('error', new Error()))
  return Promise.all([process.whenKill(), process.send('SIGINT')])

})

Test.serial('ForkedProcess.send(\'...\')', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess)
  let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

  return test.notThrowsAsync(Promise.all([process.whenKill(), process.send('SIGINT')]))

})

Test.serial('ForkedProcess.send({ ... })', async (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess)
  let process = new LoggedProcess(LogPath, Require.resolve('./worker.js'))

  await test.notThrowsAsync(process.send({}))
  return Promise.all([process.whenKill(), process.send('SIGINT')])

})

Test.serial('SpawnedProcess()', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(SpawnedProcess))()
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('SpawnedProcess(\'...\')', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(SpawnedProcess))(LogPath)
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('SpawnedProcess(\'...\', { ... })', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(SpawnedProcess))(LogPath, {})
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('SpawnedProcess(\'...\', \'...\')', (test) => {
  return test.notThrowsAsync(() => {

    const LoggedProcess = CreateLoggedProcess(SpawnedProcess)
    let process = new LoggedProcess(LogPath, Process.env.MAKE_PATH)

    return process.whenExit()

  })
})

Test.serial('SpawnedProcess(\'...\', { ... }, \'...\')', (test) => {
  return test.notThrowsAsync(() => {

    const LoggedProcess = CreateLoggedProcess(SpawnedProcess)
    let process = new LoggedProcess(LogPath, {}, Process.env.MAKE_PATH)

    return process.whenExit()

  })
})

Test.serial('SpawnedProcess(\'...\', \'...\', { ... })', (test) => {
  return test.notThrowsAsync(() => {

    const LoggedProcess = CreateLoggedProcess(SpawnedProcess)
    let process = new LoggedProcess(LogPath, Process.env.MAKE_PATH, { 'version': true })

    return process.whenExit()

  })
})
