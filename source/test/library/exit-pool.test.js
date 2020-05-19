import Test from 'ava'

import { ExitPool } from './exit-pool.js'

Test('new ExitPool()', async (test) => {

  let pool = new ExitPool({ 'numberOfProcess': 2 })
  let code = await new Promise((resolve) => {

    let code = []
    let onExit = null

    pool.on('exit', onExit = (processInformation, _code) => {

      code.push(_code)

      if (code.length === pool.numberOfProcess) {

        pool.off('exit', onExit)
        onExit = null

        resolve(code)

      }

    })

  })

  test.is(code[0], 0)

})
