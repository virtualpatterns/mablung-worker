import Cryptography from 'crypto'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateMessageId } from '../../library/create-message-id.js'

Test('CreateMessageId()', (test) => {
  return test.notThrowsAsync(CreateMessageId())
})

Test('CreateMessageId(8)', async (test) => {
  test.is((await CreateMessageId(8)).length, 8)
})

Test('CreateMessageId(9)', async (test) => {
  test.is((await CreateMessageId(9)).length, 10)
})

Test('CreateMessageId() throws Error', async (test) => {

  let randomBytesStub = Sinon
    .stub(Cryptography, 'randomBytes')
    .callsArgWith(1, new Error())

  try {
    await test.throwsAsync(CreateMessageId(), { 'instanceOf': Error })
  } finally {
    randomBytesStub.restore()
  }

})
