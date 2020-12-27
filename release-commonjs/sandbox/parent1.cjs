"use strict";

var _workerServer = require("../library/worker-server.cjs");

(async () => {
  try {
    new _workerServer.WorkerServer();
  } catch (error) {
    console.error(error);
  }
})();
//# sourceMappingURL=parent1.cjs.map