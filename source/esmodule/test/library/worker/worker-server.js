import '@virtualpatterns/mablung-source-map-support/install'
import Sinon from 'sinon'

import { WorkerServer } from '../../../index.js'

const Process = process

class Worker {

  static onError() {

    let error = new Error()
    let onErrorSpy = Sinon
      .spy(WorkerServer, 'onError')

    try {

      Process.emit('error', error)
      return onErrorSpy.calledWith(error)

    } finally {
      onErrorSpy.restore()
    }

  }

}

WorkerServer.start(Worker)
