import Test from 'ava'

Test('index.js', async (test) => {
  test.true((await import('../index.js')).OK)
})
