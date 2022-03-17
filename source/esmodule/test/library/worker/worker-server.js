import { WorkerServer } from '@virtualpatterns/mablung-worker'
import Sinon from 'sinon'
import SourceMapSupport from 'source-map-support'

SourceMapSupport.install({ 'handleUncaughtExceptions': false })

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
