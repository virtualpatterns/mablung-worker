import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import { SpawnedProcess } from '@virtualpatterns/mablung-worker'
import { Path } from '@virtualpatterns/mablung-path'
import FileSystem from 'fs-extra'
import Test from 'ava'

const FilePath = __filePath
const Process = process

const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(LogPath))
  return FileSystem.remove(LogPath)
})

Test('SpawnedProcess(\'...\')', (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH)
  return test.notThrowsAsync(process.whenExit())
})

Test('SpawnedProcess(\'...\', { ... })', (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, { 'version': true })
  return test.notThrowsAsync(process.whenExit())
})

Test('SpawnedProcess(\'...\', { ... }, { ... })', (test) => {
  let process = new LoggedProcess(Process.env.MAKE_PATH, { 'version': true }, {})
  return test.notThrowsAsync(process.whenExit())
})
