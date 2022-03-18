import Test from 'ava'

;[
  'CreateLoggedProcess',
  'CreateRandomId'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(await import('@virtualpatterns/mablung-worker/test').then((module) => module[name]))
  })
  
})
