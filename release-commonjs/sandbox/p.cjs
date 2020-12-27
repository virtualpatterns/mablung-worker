"use strict";

require("@virtualpatterns/mablung-source-map-support/install");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _workerClient = require("../library/worker-client.cjs");

var _workerPool = require("../library/worker-pool.cjs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { NextWorkerPool  } from '../library/worker-pool/next-worker-pool.js'
// import { RandomWorkerPool  } from '../library/worker-pool/random-worker-pool.js'
const Process = process;
const Require = require;
Process.once('exit', code => {
  console.log(`Process.once('exit', (${code}) => { ... })`);
});

async function main() {
  try {
    let logPath = './process/log/pool.log';

    _fsExtra.default.ensureDirSync(_path.default.dirname(logPath));

    let pool = null;
    pool = new _workerPool.WorkerPool(Require.resolve("./worker1.cjs")); // { 'numberOfProcess': 0 })

    try {
      pool.writeTo(logPath);
      console.dir(await pool.ping());
      console.dir(await pool.module.getIndex()); // await worker._process[0].process.unhandledRejection() // kill()
      // console.dir(await worker.ping())
      // await worker.getWorkerClient(1).end()
      // console.log('> worker.getWorkerClient(index).end()')
      // for (let index = 0; index < 25; index++) {
      //   await worker.getWorkerClient(index).end()
      // }
      // console.log('> worker.getWorkerClient(index).end()')
      // console.dir(await worker.ping())
      // await worker.import(Require.resolve('./worker1.js'))
      // try {
      //   // let promise = []
      //   // for (let index = 0; index < worker.numberOfWorkerClient; index++) {
      //   //   promise.push(worker.module.getPid())
      //   //   await new Promise((resolve) => setTimeout(resolve, 100))
      //   // }
      //   // let pid = null
      //   // pid = await Promise.all(promise)
      //   // pid.forEach((pid) => {
      //   //   console.log(`worker.module.getPid() = ${pid}`)
      //   // })
      //   // await worker.connectedProcess[5].process.end()
      //   // await worker.connectedProcess[5].process.end()
      //   for (let index = 0; index < worker.numberOfProcess; index++) {
      //     let _index = await worker.module.getIndex()
      //     console.log(`worker.module.getIndex() = ${_index}`)
      //     worker.getProcess(_index).process.end()
      //     // console.log(`worker.module.getPid() = ${await worker.module.getPid()}`)
      //   }
      // } finally {
      //   await worker.release()
      // }
    } finally {
      await pool.exit();
    }
  } catch (error) {
    console.error(error);
  }
}

main();
//# sourceMappingURL=p.cjs.map