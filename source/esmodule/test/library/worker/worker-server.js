import '@virtualpatterns/mablung-source-map-support/install'
import Sinon from 'sinon'

import { WorkerServer } from '../../../index.js'

const Process = process

class Worker {

  // static start() {
  //   WorkerServer.start({})
  // }

  // static stop() {
  //   WorkerServer.stop()
  // }

  static onError() {

    return new Promise((resolve) => {

      let error = new Error()
      let onErrorSpy = Sinon
        .spy(WorkerServer, 'onError')

      try {

        Process.emit('error', error)

        resolve(onErrorSpy.calledWith(error))

      } finally {
        onErrorSpy.restore()
      }

    })

  }

}

WorkerServer.start(Worker)
