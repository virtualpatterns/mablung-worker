import Test from 'ava'

import { ErrorPool } from './error-pool.js'

Test('new ErrorPool()', async (test) => {

  let pool = new ErrorPool({ 'maximumNumberOfCreate': 0, 'numberOfProcess': 2 })
  let error = await new Promise((resolve) => {

    let error = []
    let onError = null

    pool.on('error', onError = (processInformation, _error) => {

      error.push(_error)

      if (error.length === pool.numberOfProcess) {

        pool.off('error', onError)
        onError = null

        resolve(error)

      }

    })

  })

  test.is(error[0].code, 'ENOENT')

})
