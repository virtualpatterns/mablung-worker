// import FileSystem from 'fs-extra'
// import { Path } from '@virtualpatterns/mablung-path'

// import { WorkerClient  } from '../library/worker-client.js'

// import { WorkerPool  } from '../library/worker-pool.js'
// // import { NextWorkerPool  } from '../library/worker-pool/next-worker-pool.js'
// // import { RandomWorkerPool  } from '../library/worker-pool/random-worker-pool.js'

// const Process = process
// const Require = __require

// Process.once('exit', (code) => {
//   console.log(`Process.once('exit', (${code}) => { ... })`)
// })

// async function main() {

//   try {

//     let logPath = './process/log/pool.log'
//     FileSystem.ensureDirSync(Path.dirname(logPath))

//     let pool = null
//     pool = new WorkerPool(Path.resolve(FolderPath, 'worker1.js')) // { 'numberOfProcess': 0 })

//     try {

//       pool.writeTo(logPath)

//       console.dir(await pool.ping())
//       console.dir(await pool.module.getIndex())

//       // await worker._process[0].process.unhandledRejection() // kill()
//       // console.dir(await worker.ping())

//       // await worker.getWorkerClient(1).end()

//       // console.log('> worker.getWorkerClient(index).end()')
//       // for (let index = 0; index < 25; index++) {
//       //   await worker.getWorkerClient(index).end()
//       // }
//       // console.log('> worker.getWorkerClient(index).end()')

//       // console.dir(await worker.ping())

//       // await worker.import(Path.resolve(FolderPath, 'worker1.js'))

//       // try {

//       //   // let promise = []

//       //   // for (let index = 0; index < worker.numberOfWorkerClient; index++) {
//       //   //   promise.push(worker.module.getPid())
//       //   //   await new Promise((resolve) => setTimeout(resolve, 100))
//       //   // }

//       //   // let pid = null
//       //   // pid = await Promise.all(promise)

//       //   // pid.forEach((pid) => {
//       //   //   console.log(`worker.module.getPid() = ${pid}`)
//       //   // })

//       //   // await worker.connectedProcess[5].process.end()
//       //   // await worker.connectedProcess[5].process.end()

//       //   for (let index = 0; index < worker.numberOfProcess; index++) {
        
//       //     let _index = await worker.module.getIndex()
//       //     console.log(`worker.module.getIndex() = ${_index}`)

//       //     worker.getProcess(_index).process.end()

//       //     // console.log(`worker.module.getPid() = ${await worker.module.getPid()}`)

//       //   }

//       // } finally {
//       //   await worker.release()
//       // }

//     } finally {
//       await pool.exit()
//     }
      
//   } catch (error) {
//     console.error(error)
//   }

// }

// main()
