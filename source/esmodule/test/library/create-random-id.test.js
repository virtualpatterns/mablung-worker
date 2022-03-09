import { CreateRandomId } from '@virtualpatterns/mablung-worker'
import Cryptography from 'crypto'
import Sinon from 'sinon'
import Test from 'ava'

Test('CreateRandomId()', (test) => {
  return test.notThrowsAsync(CreateRandomId())
})

Test.serial('CreateRandomId() throws Error', async (test) => {

  let randomBytesStub = Sinon
    .stub(Cryptography, 'randomBytes')
    .callsArgWith(1, new Error())

  try {
    await test.throwsAsync(CreateRandomId(), { 'instanceOf': Error })
  } finally {
    randomBytesStub.restore()
  }

})

Test('CreateRandomId(8)', async (test) => {
  test.is((await CreateRandomId(8)).length, 8)
})

Test('CreateRandomId(9)', async (test) => {
  test.is((await CreateRandomId(9)).length, 10)
})
