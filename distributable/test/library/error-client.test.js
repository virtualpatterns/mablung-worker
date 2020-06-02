import { Is } from '@virtualpatterns/mablung-is';
import Test from 'ava';

import { ErrorClient } from './error-client.js';

import { WorkerClientInternalError } from '../../index.js';

Test('new ErrorClient()', async test => {

  if (Is.windows()) {
    test.throws(() => new ErrorClient(), { 'code': 'UNKNOWN' });
  } else {

    let worker = new ErrorClient();
    let error = await worker.whenRejected(WorkerClientInternalError);

    test.is(error.internalError.code, 'EACCES');

  }

});
//# sourceMappingURL=error-client.test.js.map