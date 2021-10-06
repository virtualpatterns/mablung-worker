import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, SpawnedProcess } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace(/\/release\//, '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)
const Process = process

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('SpawnedProcess()', (test) => {
  return test.throws(() => { new LoggedProcess() }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test.serial('SpawnedProcess(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {

    let process = new LoggedProcess(Process.env.MAKE_PATH)
    await process.whenExit()

  })
})

Test.serial('SpawnedProcess(\'...\', { ... })', (test) => {
  return test.notThrowsAsync(async () => {
    
    let process = new LoggedProcess(Process.env.MAKE_PATH, { 'version': true })
    await process.whenExit()

  })
})

Test.serial('SpawnedProcess(\'...\', { ... }, { ... })', (test) => {
  return test.notThrowsAsync(async () => {

    let process = new LoggedProcess(Process.env.MAKE_PATH, { 'version': true }, {})
    await process.whenExit()

  })
})

Test.serial('SpawnedProcess(\'...\', long, long)', (test) => {
  return test.notThrowsAsync(async () => {

    let process = new LoggedProcess(Process.env.MAKE_PATH, { 'abcdefghi': true, 'jklmnopqr': true, 'stuvwxyz': true, 'a123456789': true, 'b123456789': true, 'c123456789': true }, { 'abcdefghi': true, 'jklmnopqr': true, 'stuvwxyz': true, 'a123456789': true, 'b123456789': true, 'c123456789': true })
    await process.whenExit()

  })
})
