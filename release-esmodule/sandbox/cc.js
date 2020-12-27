import { WorkerClient } from '../library/worker-client.js';
import { LoggedClient } from '../library/test/logged-client.js';
// import { ErrorClient } from '../library/test/error-client.js'

let workerClient = new WorkerClient();
let loggedClient = new LoggedClient();
// let errorClient = new ErrorClient()

console.log(workerClient.pid);

// errorClient.end()
loggedClient.end();
workerClient.end();
//# sourceMappingURL=cc.js.map