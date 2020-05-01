import Test from 'ava'

import { ExitClient } from './exit-client.js'

import { WorkerClientExitedError } from '../../index.js'

Test('new ExitClient()', async (test) => {
  let worker = new ExitClient()
  await test.notThrowsAsync(worker.whenRejected(WorkerClientExitedError))
})
