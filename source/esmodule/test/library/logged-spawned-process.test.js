import { CreateRandomId } from '@virtualpatterns/mablung-worker'
import { LoggedSpawnedProcess } from '@virtualpatterns/mablung-worker/test'
import { Path } from '@virtualpatterns/mablung-path'
import Test from 'ava'
import FileSystem from 'fs-extra'

const FilePath = __filePath
const Process = process

const DataPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '')

Test.before(async () => {
  await FileSystem.remove(DataPath)
  return FileSystem.ensureDir(DataPath)
})

Test('LoggedSpawnedProcess()', (test) => {
  test.throws(() => { new LoggedSpawnedProcess() }, { 'code': 'ERR_INVALID_ARG_TYPE' })
})

Test('LoggedSpawnedProcess(\'...\', \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, Process.env.MAKE_PATH).whenExit())

})

Test('LoggedSpawnedProcess(\'...\', \'...\', { ... }, { ... })', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, Process.env.MAKE_PATH, {
      '--annabelle': 'bernadette',
      '--benjamin': 'claudius',
      '--claudette': 'danaldus'
    }, {
      '--annabelle': 'bernadette'
    }).whenExit())

})

Test('LoggedSpawnedProcess(\'...\', { ... }, \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, {}, Process.env.MAKE_PATH).whenExit())

})

Test('LoggedSpawnedProcess(\'...\', { ... }, { ... }, \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  await test.notThrowsAsync(new LoggedSpawnedProcess(logPath, {}, {}, Process.env.MAKE_PATH).whenExit())

})

Test('LoggedSpawnedProcess(\'...\', { ... }, { ... }, { ... }, \'...\')', async (test) => {

  let id = await CreateRandomId()
  let logPath = Path.resolve(DataPath, `${id}.log`)

  test.throws(() => { new LoggedSpawnedProcess(logPath, {}, {}, {}, Process.env.MAKE_PATH) }, { 'code': 'ERR_INVALID_ARG_TYPE' })

})
