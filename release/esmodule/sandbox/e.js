import { createRequire as _createRequire } from "module";
import { LoggedClient } from '../library/worker-client/logged-client.js';

const Require = _createRequire(import.meta.url);

(async () => {

  try {

    let worker = await LoggedClient.createWorker(Require.resolve('../library/worker/get-pid.js'));

    try {
      await worker.throw(new Error('You suck!'));
    } finally {
      // await worker.end()
    }

  } catch (error) {
    console.error(error);
  }

})();

//# sourceMappingURL=e.js.map