import { Check } from '@virtualpatterns/mablung-check-dependency'
import Test from 'ava'

const Process = process

Test('default', async (test) => {

  let dependency = await Check()

  // test.log(dependency.missing)
  test.deepEqual(dependency.missing, {})
  test.deepEqual(dependency.unused, [])

})

Test('section', async (test) => {

  let dependency = await Check(Process.cwd(), {
    'ignoreMatch': [
      '@virtualpatterns/mablung-console',
      '@virtualpatterns/mablung-path'
    ]
  })

  test.deepEqual(dependency.section, {})

})
