import Test from 'ava'

import { ChildProcessSignalError } from '../../index.js'
import { WorkerServerNoIPCChannelError } from '../../library/error/worker-server-no-ipc-channel-error.js'

Test('ChildProcessSignalError', (test) => {
  test.throws(() => { throw new ChildProcessSignalError() }, { 'instanceOf': ChildProcessSignalError })
})

Test('WorkerServerNoIPCChannelError', (test) => {
  test.throws(() => { throw new WorkerServerNoIPCChannelError() }, { 'instanceOf': WorkerServerNoIPCChannelError })
})
