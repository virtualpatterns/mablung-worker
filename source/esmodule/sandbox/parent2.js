// import { createRequire } from 'module'

// import { WorkerClient } from '../index.js'

// const Process = process
// const Require = __require

// Process.on('exit', () => {
//   console.log('PARENT Process.on(\'exit\', () => { ... })')
// })

// ;(async () => {

//   try {

//     let worker = await WorkerClient.createWorker(Path.resolve(FolderPath, '../library/worker/create-worker.js'), { 'execArgv': [ /* '--inspect=19000' */ ], 'stdio': 'inherit' })

//     try {

//       console.log(await worker.getPid())

//     } finally {
//       await worker.end()
//     }

//   } catch (error) {
//     console.error(error)
//   }

// })()
