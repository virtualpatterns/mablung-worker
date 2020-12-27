import { createRequire as _createRequire } from "module";
import { LoggedClient } from '../test/library/logged-client.js';

const Require = _createRequire(import.meta.url);

async function main() {

  try {

    let worker = new LoggedClient();

    try {

      await worker.import(Require.resolve('../test/library/worker.js'));

      try {
        // do nothing
      } finally {
        // await worker.release()
      }

    } finally {
      await worker.end();
    }

  } catch (error) {
    console.error(error);
  }

}

main();
//# sourceMappingURL=onX.js.map