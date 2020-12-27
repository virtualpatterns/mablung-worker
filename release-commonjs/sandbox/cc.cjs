"use strict";

var _workerClient = require("../library/worker-client.cjs");

var _loggedClient = require("../library/test/logged-client.cjs");

// import { ErrorClient } from '../library/test/error-client.js'
let workerClient = new _workerClient.WorkerClient();
let loggedClient = new _loggedClient.LoggedClient(); // let errorClient = new ErrorClient()

console.log(workerClient.pid); // errorClient.end()

loggedClient.end();
workerClient.end();
//# sourceMappingURL=cc.cjs.map