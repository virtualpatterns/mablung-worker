import '@virtualpatterns/mablung-source-map-support/install'

import { WorkerServer } from '../../../index.js'

const Process = process

class Worker {

  static start() {
    console.log('Worker.start()')

    Process.once('SIGHUP', this.onSIGHUPHandler = () => {

      delete this.onSIGHUPHandler

      try {

        WorkerServer.stop()
        Process.exitCode = 42

      /* c8 ignore next 3 */
      } catch (error) {
        Process.emit('error', error)
      }

    })

  }

  static stop() {
    console.log('Worker.stop()')

    if (this.onSIGHUPHandler) {
      Process.off('SIGHUP', this.onSIGHUPHandler)
      delete this.onSIGHUPHandler
    }

  }

}

WorkerServer.start(Worker)
