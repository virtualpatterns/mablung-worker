import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

import { CreateLoggedProcess, SpawnedProcess } from '../../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)
const Process = process

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  await FileSystem.remove(LogPath)
})

Test.serial('SpawnedProcess(\'...\')', (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH)
  return test.notThrowsAsync(process.whenExit())
})

Test.serial('SpawnedProcess(invalid)', (test) => {
  let process = new LoggedProcess('invalid')
  return test.throwsAsync(process.whenExit(), { 'code': 'ENOENT' })
})

Test.serial('SpawnedProcess(\'...\', { ... })', (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, { 'version': true })
  return test.notThrowsAsync(process.whenExit())
})

Test.serial('SpawnedProcess(\'...\', { ... }, { ... })', (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, { 'version': true }, {})
  return test.notThrowsAsync(process.whenExit())
})

Test.serial('SpawnedProcess(\'...\', long, long)', (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, { 'abcdefghi': true, 'jklmnopqr': true, 'stuvwxyz': true, 'a123456789': true, 'b123456789': true, 'c123456789': true }, { 'abcdefghi': true, 'jklmnopqr': true, 'stuvwxyz': true, 'a123456789': true, 'b123456789': true, 'c123456789': true })
  return test.notThrowsAsync(process.whenExit())
})
