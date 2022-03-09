import Test from 'ava'

;[
  'CreateLoggedProcess'
].forEach((name) => {

  Test(name, async (test) => {
    test.truthy(await import('@virtualpatterns/mablung-worker/test').then((module) => module[name]))
  })
  
})
