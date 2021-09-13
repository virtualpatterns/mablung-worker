import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Is } from '@virtualpatterns/mablung-is'
import Cryptography from 'crypto'

import { ForkedProcess } from './forked-process.js'
import { WorkerClientHandler } from './worker-client-handler.js'

class WorkerClient extends ForkedProcess {

  constructor(...argument) {
    super(...argument)

    this._isReady = false
    this._worker = new Proxy(this, WorkerClientHandler)

  }

  get defaultArgument() {
    return super.defaultArgument
  }

  get defaultOption() {
    return Configuration.getOption(super.defaultOption, { 'maximumDuration': 5000 })
  }

  get maximumDuration() {
    return this.option.maximumDuration
  }

  set maximumDuration(value) {
    this.option.maximumDuration = value
  }

  get worker() {
    return this._worker
  }

  async whenReady() {

    switch (this._isReady) {
      case true:
        return
      default:

        // server lets us know when it's ready
        await this.whenMessage((message) => message.type === 'ready')
        
        // letting server know we're ready
        await this.send({ 'type': 'ready' })

        this._isReady = true

    }

  }

  whenMessage(compareFn = () => true) {
    return super.whenMessage(this.maximumDuration, compareFn)
  }

  whenExit() {
    return super.whenExit(this.maximumDuration)
  }

  whenKill() {
    return super.whenKill(this.maximumDuration)
  }

  whenError() {
    return super.whenError(this.maximumDuration)
  }

  ping() {
    return this.send({ 'type': 'ping' })
  }

  exit(code = 0) {
    // using super since there will be no response
    return Promise.all([ this.whenExit(), super.send({ 'type': 'exit', 'code': code }) ])
  }

  kill(signal = 'SIGINT') {
    return Promise.all([ this.whenKill(), this.send(signal) ])
  }

  async send(message) {

    if (Is.string(message)) {
      await super.send(message)
    } else {

      let messageId = await WorkerClient.createMessageId()
      let requestMessage = { id: messageId, ...message }

      let [ responseMessage ] = await Promise.all([
        this.whenMessage((message) => message.id === messageId),
        super.send(requestMessage)
      ])

      if (responseMessage.error) {
        throw responseMessage.error
      } else {
        return responseMessage.returnValue
      }

    }

  }

  static createMessageId() {

    return new Promise((resolve, reject) => {

      Cryptography.randomBytes(16, (error, buffer) => {
        if (Is.not.null(error)) {
          /* c8 ignore next 1 */
          reject(error)
        } else {
          resolve(buffer.toString('hex'))
        }
      })

    })

  }

}

export { WorkerClient }