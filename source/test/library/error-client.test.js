import Test from 'ava'

import { ErrorClient } from './error-client.js'

import { WorkerClientInternalError } from '../../index.js'

Test('new ErrorClient()', async (test) => {

  let worker = new ErrorClient()
  let error = await worker.whenRejected(WorkerClientInternalError)

  test.is(error.internalError.code, 'ENOENT')

})