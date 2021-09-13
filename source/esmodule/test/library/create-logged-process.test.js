import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, ForkedProcess } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.c?js$/, '.log')
const Require = __require

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('CreateLoggedProcess(...)', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(ForkedProcess))()
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('CreateLoggedProcess(..., \'...\')', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(ForkedProcess, LogPath))()
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('CreateLoggedProcess(..., \'...\', { ... })', (test) => {
  return test.throws(() => {
    new (CreateLoggedProcess(ForkedProcess, LogPath, {}))()
  }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('ForkedProcess.onMessage({ ... })', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
  let process = new LoggedProcess(Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('message', {}))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])

})

Test.serial('ForkedProcess.onMessage(\'...\')', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
  let process = new LoggedProcess(Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('message', 'SIGINT'))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])

})

Test.serial('ForkedProcess.onExit(...)', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
  let process = new LoggedProcess(Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('exit', 0, null))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])

})

Test.serial('ForkedProcess.onKill(...)', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
  let process = new LoggedProcess(Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('exit', null, 'SIGINT'))
  return Promise.all([ process.whenKill(), process.send('SIGINT') ])
  
})

Test.serial('ForkedProcess.onError(...)', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
  let process = new LoggedProcess(Require.resolve('./worker.js'))

  test.notThrows(() => process.process.emit('error', new Error()))
  return Promise.all([process.whenKill(), process.send('SIGINT')])

})

Test.serial('ForkedProcess.send(\'...\')', (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
  let process = new LoggedProcess(Require.resolve('./worker.js'))

  return test.notThrowsAsync(Promise.all([process.whenKill(), process.send('SIGINT')]))

})

Test.serial('ForkedProcess.send({ ... })', async (test) => {

  const LoggedProcess = CreateLoggedProcess(ForkedProcess, LogPath)
  let process = new LoggedProcess(Require.resolve('./worker.js'))

  await test.notThrowsAsync(process.send({}))
  return Promise.all([process.whenKill(), process.send('SIGINT')])

})
