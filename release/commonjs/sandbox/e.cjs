"use strict";

var _loggedClient = require("../library/worker-client/logged-client.cjs");

const Require = require;

(async () => {
  try {
    let worker = await _loggedClient.LoggedClient.createWorker(Require.resolve("../library/worker/get-pid.cjs"));

    try {
      await worker.throw(new Error('You suck!'));
    } finally {// await worker.end()
    }
  } catch (error) {
    console.error(error);
  }
})();

//# sourceMappingURL=e.cjs.map