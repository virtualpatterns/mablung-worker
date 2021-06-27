"use strict";

var _loggedClient = require("../test/library/logged-client.cjs");

const Require = require;

async function main() {
  try {
    let worker = new _loggedClient.LoggedClient();

    try {
      await worker.import(Require.resolve("../test/library/worker.cjs"));

      try {// do nothing
      } finally {// await worker.release()
      }
    } finally {
      await worker.end();
    }
  } catch (error) {
    console.error(error);
  }
}

main();

//# sourceMappingURL=onX.cjs.map