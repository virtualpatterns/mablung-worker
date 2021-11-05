import { Console } from '@virtualpatterns/mablung-worker/test'
import FileSystem from 'fs-extra'
import Path from 'path'
import Test from 'ava'

const FilePath = __filePath

const LogPath = FilePath.replace('/release/', '/data/').replace('.test.js', '.log')

Test.before(() => {
  return FileSystem.ensureDir(Path.dirname(LogPath))
})

Test.beforeEach(() => {
  return FileSystem.remove(LogPath)
})

Test.serial('Console(\'...\')', (test) => {
  test.notThrows(() => { (new Console(LogPath)).close() })
})

Test.serial('Console(\'...\', { ... })', (test) => {
  test.notThrows(() => { (new Console(LogPath, {})).close() })
})

Test.serial('Console(\'...\', { ... }, { ... })', (test) => {
  test.notThrows(() => { (new Console(LogPath, {}, {})).close() })
})

Test.serial('close()', (test) => {
  test.notThrows(() => { (new Console(LogPath)).close() })
})

Test.serial('trace(\'...\')', (test) => {
  test.notThrows(() => {

    let _console = new Console(LogPath)

    try {
      _console.trace('Console#trace(\'...\')')
    } finally {
      _console.close()
    }

  })
})

Test.serial('debug(\'...\')', (test) => {
  test.notThrows(() => {

    let _console = new Console(LogPath)

    try {
      _console.debug('Console#debug(\'...\')')
    } finally {
      _console.close()
    }

  })
})

Test.serial('info(\'...\')', (test) => {
  test.notThrows(() => {

    let _console = new Console(LogPath)

    try {
      _console.info('Console#info(\'...\')')
    } finally {
      _console.close()
    }

  })
})

Test.serial('warn(\'...\')', (test) => {
  test.notThrows(() => {

    let _console = new Console(LogPath)

    try {
      _console.warn('Console#warn(\'...\')')
    } finally {
      _console.close()
    }

  })
})

Test.serial('error(\'...\')', (test) => {
  test.notThrows(() => {

    let _console = new Console(LogPath)

    try {
      _console.error('Console#error(\'...\')')
    } finally {
      _console.close()
    }

  })
})

Test.serial('log(\'...\')', (test) => {
  test.notThrows(() => {

    let _console = new Console(LogPath)

    try {
      _console.log('Console#log(\'...\')')
    } finally {
      _console.close()
    }

  })
})

Test.serial('dir({ ... })', (test) => {
  test.notThrows(() => {

    let _console = new Console(LogPath)

    try {
      _console.dir({
        'message': 'Console#dir(\'...\')'
      })
    } finally {
      _console.close()
    }

  })
})
