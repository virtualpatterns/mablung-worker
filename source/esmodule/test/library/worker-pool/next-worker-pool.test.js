import Sinon from 'sinon'
import Test from 'ava'

import { NextWorkerPool } from '../../../index.js'

const Require = __require

Test('NextWorkerPool._selectProcess(methodName, parameter)', async (test) => {

  const sandbox = Sinon.createSandbox()

  try {

    let pool = new NextWorkerPool(Require.resolve('../worker.js'))

    try {

      sandbox.spy(pool, '_selectProcess')

      await pool.module.getPid()

      test.true(pool._selectProcess.calledOnce)
      test.true(pool._selectProcess.calledWith('getPid', []))

    } finally {
      await pool.exit()
    }
  
  } finally {
    sandbox.restore()
  }

})

