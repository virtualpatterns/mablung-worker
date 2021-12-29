import '@virtualpatterns/mablung-source-map-support/install'
import FileSystem from 'fs-extra'
import Path from 'path'

import { CreateLoggedProcess, WorkerClient } from '../index.js'

const FilePath = __filePath
const LogPath = FilePath.replace('/release/', '/data/').replace(/\.test\.c?js$/, '.log')
const LoggedClient = CreateLoggedProcess(WorkerClient, LogPath)
const Require = __require
const WorkerPath = Require.resolve('../test/library/worker/worker-client.js')

async function main() {

  try {

    await FileSystem.ensureDir(Path.dirname(LogPath))

    let client = new LoggedClient(WorkerPath)

    try {

      await client.whenReady()

      try {
        await client.ping()
      } finally {
        await client.exit()
      }

    } catch (error) {
      await client.kill()
      throw error
    }

  } catch (error) {
    console.error(error)
  }

}

main()