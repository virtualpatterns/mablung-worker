"use strict";

var _module = require("module");

var _index = require("../index.cjs");

const Process = process;
const Require = require;
Process.on('exit', () => {
  console.log('PARENT Process.on(\'exit\', () => { ... })');
});

(async () => {
  try {
    let worker = await _index.WorkerClient.createWorker(Require.resolve("../library/worker/create-worker.cjs"), {
      'execArgv': [
        /* '--inspect=19000' */
      ],
      'stdio': 'inherit'
    });

    try {
      console.log(await worker.getPid());
    } finally {
      await worker.end();
    }
  } catch (error) {
    console.error(error);
  }
})();

//# sourceMappingURL=parent2.cjs.map