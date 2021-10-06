import '@virtualpatterns/mablung-source-map-support/install'

import { WorkerServer } from '../../../index.js'

const Process = process

class Worker {

  static start() {
    console.log('Worker.start()')

    Process.once('SIGHUP', () => {

      try {

        WorkerServer.stop()
        Process.exitCode = 42

      } catch (error) {
        Process.emit('error', error)
      }

    })

  }

  static stop() {
    console.log('Worker.stop()')
  }

}

WorkerServer.start(Worker)
