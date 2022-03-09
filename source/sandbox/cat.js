import '@virtualpatterns/mablung-source-map-support/install'

import { CreateLoggedProcess } from '@virtualpatterns/mablung-worker/test'
import FileSystem from 'fs-extra'
import { Path } from '@virtualpatterns/mablung-path'
import { SpawnedProcess } from '@virtualpatterns/mablung-worker'

const FilePath = __filePath
const Process = process
// const Require = __require

const DataPath = FilePath.replace('/release/', '/data/').replace('.js', '')
const DatabasePath = DataPath.concat('/default.db')
const LogPath = DataPath.concat('.log')
const LoggedProcess = CreateLoggedProcess(SpawnedProcess, LogPath)

async function main() {

  try {

    Process.exitCode = 0

    await FileSystem.ensureDir(Path.dirname(LogPath))
    await FileSystem.remove(LogPath)

    let process = new LoggedProcess('rqlited', [
      '-on-disk',
      '-on-disk-path', DatabasePath,
      '-http-addr', 'localhost:4000',
      '-raft-addr', 'localhost:4010',
      Path.dirname(DatabasePath)
    ])

    console.log(await process.whenOutput((data) => /node is ready/im.test(data)))
    await Promise.all([ process.whenExit(), process.send('SIGINT') ])

  } catch (error) {
    Process.exitCode = 1
    console.error(error)
  }

}

main()