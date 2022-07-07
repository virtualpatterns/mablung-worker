import { CreateRandomId, LoggedSpawnedProcess } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'
import FileSystem from 'fs-extra'

const FilePath = __filePath
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')

Test.before(() => {
  return FileSystem.emptyDir(DataPath)
})

Test.beforeEach(async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.context.logPath = logPath

})

Test('LoggedSpawnedProcess()', (test) => {
  test.throws(() => { new LoggedSpawnedProcess() }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test('LoggedSpawnedProcess(\'...\', \'...\')', (test) => {
  return test.notThrowsAsync(new LoggedSpawnedProcess(test.context.logPath, Process.env.MAKE_PATH).whenExit())
})

Test('LoggedSpawnedProcess(\'...\', \'...\', { ... }, { ... })', (test) => {
  return test.notThrowsAsync(new LoggedSpawnedProcess(test.context.logPath, Process.env.MAKE_PATH, {
    '--annabelle': 'bernadette',
    '--benjamin': 'claudius',
    '--claudette': 'danaldus'
  }, {
    '--annabelle': 'bernadette'
  }).whenExit())
})

Test('LoggedSpawnedProcess(\'...\', { ... }, \'...\')', (test) => {
  return test.notThrowsAsync(new LoggedSpawnedProcess(test.context.logPath, {}, Process.env.MAKE_PATH).whenExit())
})

Test('LoggedSpawnedProcess(\'...\', { ... }, { ... }, \'...\')', (test) => {
  return test.notThrowsAsync(new LoggedSpawnedProcess(test.context.logPath, {}, {}, Process.env.MAKE_PATH).whenExit())
})

Test('LoggedSpawnedProcess(\'...\', { ... }, { ... }, { ... }, \'...\')', (test) => {
  test.throws(() => { new LoggedSpawnedProcess(test.context.logPath, {}, {}, {}, Process.env.MAKE_PATH) }, { 'code': 'ERR_INVALID_ARG_TYPE' })

})
