"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _childProcess = require("./library/child-process.cjs");

Object.keys(_childProcess).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _childProcess[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _childProcess[key];
    }
  });
});

var _forkedProcess = require("./library/forked-process.cjs");

Object.keys(_forkedProcess).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _forkedProcess[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _forkedProcess[key];
    }
  });
});

var _workerClient = require("./library/worker-client.cjs");

Object.keys(_workerClient).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerClient[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerClient[key];
    }
  });
});

var _workerPool = require("./library/worker-pool.cjs");

Object.keys(_workerPool).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerPool[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerPool[key];
    }
  });
});

var _nextWorkerPool = require("./library/worker-pool/next-worker-pool.cjs");

Object.keys(_nextWorkerPool).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _nextWorkerPool[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _nextWorkerPool[key];
    }
  });
});

var _randomWorkerPool = require("./library/worker-pool/random-worker-pool.cjs");

Object.keys(_randomWorkerPool).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _randomWorkerPool[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _randomWorkerPool[key];
    }
  });
});

var _workerClientDisconnectedError = require("./library/error/worker-client-disconnected-error.cjs");

Object.keys(_workerClientDisconnectedError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerClientDisconnectedError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerClientDisconnectedError[key];
    }
  });
});

var _workerClientDurationExceededError = require("./library/error/worker-client-duration-exceeded-error.cjs");

Object.keys(_workerClientDurationExceededError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerClientDurationExceededError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerClientDurationExceededError[key];
    }
  });
});

var _workerClientExitedError = require("./library/error/worker-client-exited-error.cjs");

Object.keys(_workerClientExitedError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerClientExitedError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerClientExitedError[key];
    }
  });
});

var _workerClientInternalError = require("./library/error/worker-client-internal-error.cjs");

Object.keys(_workerClientInternalError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerClientInternalError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerClientInternalError[key];
    }
  });
});

var _workerClientKilledError = require("./library/error/worker-client-killed-error.cjs");

Object.keys(_workerClientKilledError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerClientKilledError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerClientKilledError[key];
    }
  });
});

var _workerPoolDisconnectedError = require("./library/error/worker-pool-disconnected-error.cjs");

Object.keys(_workerPoolDisconnectedError).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _workerPoolDisconnectedError[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _workerPoolDisconnectedError[key];
    }
  });
});

var _loggedClient = require("./test/library/logged-client.cjs");

Object.keys(_loggedClient).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _loggedClient[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _loggedClient[key];
    }
  });
});

var _loggedPool = require("./test/library/logged-pool.cjs");

Object.keys(_loggedPool).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _loggedPool[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _loggedPool[key];
    }
  });
});
//# sourceMappingURL=index.cjs.map