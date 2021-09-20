import Test from 'ava'

import { WorkerServerNoIPCChannelError } from '../../library/error/worker-server-no-ipc-channel-error.js'

Test('WorkerServerNoIPCChannelError', (test) => {
  test.throws(() => { throw new WorkerServerNoIPCChannelError() }, { 'instanceOf': WorkerServerNoIPCChannelError })
})
