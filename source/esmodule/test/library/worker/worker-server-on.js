import '@virtualpatterns/mablung-source-map-support/install'

import { WorkerServer } from '@virtualpatterns/mablung-worker'
import Sinon from 'sinon'

const Process = process

class Worker {

  static onInterval() {

    return new Promise((resolve, reject) => {

      let onIntervalStub = Sinon
        .stub(WorkerServer, 'onInterval')
        .throws(new Error())

      try {

        let onErrorStub = Sinon
          .stub(WorkerServer, 'onError')
          .callsFake(function (error) {
            reject(error)
          })

        try {
          Process.emit('interval')
        } finally {
          onErrorStub.restore()
        }

      } finally {
        onIntervalStub.restore()
      }

    })

  }

  static onMessage() {

    return new Promise((resolve, reject) => {

      let onMessageStub = Sinon
        .stub(WorkerServer, 'onMessage')
        .throws(new Error())

      try {

        let onErrorStub = Sinon
          .stub(WorkerServer, 'onError')
          .callsFake(function (error) {
            reject(error)
          })

        try {
          Process.emit('message', {})
        } finally {
          onErrorStub.restore()
        }

      } finally {
        onMessageStub.restore()
      }

    })

  }

  static onBeforeExit() {

    return new Promise((resolve, reject) => {

      let onBeforeExitStub = Sinon
        .stub(WorkerServer, 'onBeforeExit')
        .throws(new Error())

      try {

        let onErrorStub = Sinon
          .stub(WorkerServer, 'onError')
          .callsFake(function (error) {
            reject(error)
          })

        try {
          Process.emit('beforeExit', null, null)
        } finally {
          onErrorStub.restore()
        }

      } finally {
        onBeforeExitStub.restore()
      }

    })

  }

  /* c8 ignore start */
  static onExit() {

    return new Promise((resolve, reject) => {

      let onExitStub = Sinon
        .stub(WorkerServer, 'onExit')
        .throws(new Error())

      try {

        let onErrorStub = Sinon
          .stub(WorkerServer, 'onError')
          .callsFake(function (error) {
            reject(error)
          })

        try {
          Process.emit('exit', null, null)
        } finally {
          onErrorStub.restore()
        }

      } finally {
        onExitStub.restore()
      }

    })

  }
  /* c8 ignore stop */

  /* c8 ignore start */
  static onError() {

    return new Promise((resolve, reject) => {

      let onErrorStub = Sinon
        .stub(WorkerServer, 'onError')
        .throws(new Error())

      try {

        let errorStub = Sinon
          .stub(console, 'error')
          .callsFake(function (...argument) {
            reject(...argument)
          })

        try {
          Process.emit('error', new Error())
        } finally {
          errorStub.restore()
        }

      } finally {
        onErrorStub.restore()
      }

    })

  }
  /* c8 ignore stop */

}

WorkerServer.start(Worker)
