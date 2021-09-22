import '@virtualpatterns/mablung-source-map-support/install'
import Sinon from 'sinon'

import { WorkerServer } from '../../../index.js'

const Process = process

class Worker {

  static send() {}

  static async sendThrowsError() {

    let sendStub = Sinon
      .stub(Process, 'send')
      .callsArgWith(1, new Error())

    try {
      await WorkerServer.send({})
    } finally {
      sendStub.restore()
    }

  }

  static async sendThrowsWorkerServerNoIPCChannelError() {

    let send = Process.send
    delete Process.send

    try {
      await WorkerServer.send({})
    } finally {
      Process.send = send
    }

  }

}

WorkerServer.start(Worker)