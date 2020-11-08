import Test from 'ava';

import { ExitClient } from './exit-client.js';

import { WorkerClientExitedError } from '../../index.js';

Test('new ExitClient()', async test => {
  await test.notThrowsAsync(new ExitClient().whenRejected(WorkerClientExitedError));
});
//# sourceMappingURL=exit-client.test.js.map