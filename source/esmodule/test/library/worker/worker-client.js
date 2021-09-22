import '@virtualpatterns/mablung-source-map-support/install'

import { WorkerServer } from '../../../index.js'

const Process = process

class Worker {

  static start() {
    this.attachAllHandler()
  }

  static attachAllHandler() {

    Process.on('exit', this.onExitHandler = (code) => {

      try {
        this.detachAllHandler()
        this.onExit(code)
      } catch (error) {
        Process.emit('error', error)
      }

    })

    Process.on('SIGHUP', this.onSIGHUPHandler = () => {

      try {
        this.onSIGHUP()
      } catch (error) {
        Process.emit('error', error)
      }

    })

  }

  static detachAllHandler() {

    if (this.onSIGHUPHandler) {
      Process.off('SIGHUP', this.onSIGHUPHandler)
      delete this.onSIGHUPHandler
    }

    if (this.onExitHandler) {
      Process.off('exit', this.onExitHandler)
      delete this.onExitHandler
    }

  }

  static onExit(code) {
    console.log(`Worker.onExit(${code})`)
  }

  static onSIGHUP() {
    console.log('Worker.onSIGHUP()')
    Process.exit(42)
  }

}

WorkerServer.start(Worker)
