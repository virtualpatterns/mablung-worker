import '@virtualpatterns/mablung-source-map-support/install'
import Command from 'commander'
import FileSystem from 'fs'
import JSON5 from 'json5'
import Path from 'path'
// import URL from 'url'
// import Utilities from 'util'

const Process = process
const Require = __require

const Package = JSON5.parse(FileSystem.readFileSync(Require.resolve('../../package.json'), { 'encoding': 'utf-8' }))

;(async () => {

  console.log(Require.resolve('./worker-server.js'))

  Command.version(Package.version)
  Command.option('--worker-server-class-path <path>', 'Path to the server class to import/create', Require.resolve('./worker-server.js'))
  Command.option('--import-path <path>', 'Path to the module to import', Require.resolve('./worker.js'))

  Command.parse(Process.argv)

  // console.log('-'.repeat(80))
  // console.log(`Process.version               = '${Process.version}'`)
  // console.log(`Package.version               = 'v${Package.version}'`)
  // console.log(`Process.argv[0]               = '${Process.argv[0]}'`)
  // console.log(`Process.execArgv              = ${Utilities.inspect(Process.execArgv)}`)
  // console.log(`Process.argv[1]               = '${Path.relative(Process.cwd(), Process.argv[1])}'`)
  // console.log(`Command.opts().workerServerClassPath = '${Path.relative(Process.cwd(), Command.opts().workerServerClassPath)}'`)
  // console.log(`Command.opts().importPath            = '${Path.relative(Process.cwd(), Command.opts().importPath)}'`)

  let workerServerClass = null
  workerServerClass = await import(Command.opts().workerServerClassPath) // URL.pathToFileURL(Command.opts().workerServerClassPath))
  workerServerClass = workerServerClass.default || workerServerClass

  // console.log(`workerServerClass.name        = ${workerServerClass.name}`)
  // console.log('-'.repeat(80))

  await (new workerServerClass()).import(Command.opts().importPath)

})()
