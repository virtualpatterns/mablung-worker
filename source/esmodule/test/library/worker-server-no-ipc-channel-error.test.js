import { WorkerServerNoIPCChannelError } from '@virtualpatterns/mablung-worker'
import Test from 'ava'

Test('WorkerServerNoIPCChannelError', (test) => {
  test.throws(() => { throw new WorkerServerNoIPCChannelError() }, { 'instanceOf': WorkerServerNoIPCChannelError })
})
