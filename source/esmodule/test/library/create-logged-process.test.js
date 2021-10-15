import FileSystem from 'fs-extra'
import Path from 'path'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateLoggedProcess, SpawnedProcess } from '../../index.js'

const FilePath = __filePath
const ValidLogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const InvalidLogPath = FilePath.replace('/release/', '/invalid/').replace(/\.test\.c?js$/, '.log')
const Process = process

Test.before(async () => {
  await FileSystem.ensureDir(Path.dirname(ValidLogPath))
  await FileSystem.remove(ValidLogPath)
})

Test.serial('CreateLoggedProcess(..., \'...\')', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, ValidLogPath) })
})

Test.serial('CreateLoggedProcess(..., \'...\', { ... }, { ... })', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, ValidLogPath, {}, {}) })
})

Test.serial('CreateLoggedProcess(..., invalid)', (test) => {
  test.notThrows(() => { CreateLoggedProcess(SpawnedProcess, InvalidLogPath) })
})

Test.serial('CreateLoggedProcess(..., \'...\')(\'...\')', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, ValidLogPath))(Process.env.MAKE_PATH)
  return test.notThrowsAsync(process.whenExit())
})

Test.serial('CreateLoggedProcess(..., invalid)(\'...\')', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, InvalidLogPath))(Process.env.MAKE_PATH)
  return test.notThrowsAsync(process.whenExit())
})

Test.serial('CreateLoggedProcess(..., \'...\')(\'...\') throws Error', (test) => {

  let createWriteStreamStub = Sinon
    .stub(FileSystem, 'createWriteStream')
    .throws(new Error())

  try {
        
    return test.notThrowsAsync(async () => {
      let process = new (CreateLoggedProcess(SpawnedProcess, ValidLogPath))(Process.env.MAKE_PATH)
      await process.whenExit()
    })

  } finally {
    createWriteStreamStub.restore()
  }

})

Test.serial('CreateLoggedProcess(..., \'...\', { ... }, { ... })(\'...\')', (test) => {
  let process = new (CreateLoggedProcess(SpawnedProcess, ValidLogPath, {}, {}))(Process.env.MAKE_PATH)
  return test.notThrowsAsync(process.whenExit())
})
