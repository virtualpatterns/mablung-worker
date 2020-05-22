import Sinon from 'sinon'
import Test from 'ava'

import { RandomWorkerPool } from '../../../index.js'

const Require = __require

Test('RandomWorkerPool._selectProcess(methodName, parameter)', async (test) => {

  const sandbox = Sinon.createSandbox()

  try {

    let pool = new RandomWorkerPool(Require.resolve('../worker.js'))

    try {

      sandbox.spy(pool, '_selectProcess')

      await pool.module.getPid()

      test.true(pool._selectProcess.calledOnce)
      test.true(pool._selectProcess.calledWith('getPid', []))

    } finally {
      await pool.end()
    }
  
  } finally {
    sandbox.restore()
  }

})

