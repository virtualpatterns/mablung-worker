import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Is } from '@virtualpatterns/mablung-is'

import { CreateMessageId } from './create-message-id.js'
import { ForkedProcess } from './forked-process.js'
import { WorkerClientHandler } from './worker-client-handler.js'

class WorkerClient extends ForkedProcess {

  static MaximumDuration = 5000

  constructor(...argument) {
    super(...argument)

    this.worker = new Proxy(this, WorkerClientHandler)
    this.isReady = false

  }

  get defaultArgument() {
    return super.defaultArgument
  }

  get defaultOption() {
    return Configuration.merge(super.defaultOption, { 'maximumDuration': WorkerClient.MaximumDuration })
  }

  get maximumDuration() {
    return this.option.maximumDuration
  }

  set maximumDuration(value) {
    this.option.maximumDuration = value
  }

  async ping() {

    let requestMessage = { 'type': 'ping' }
    let responseMessage = await this.send(requestMessage, true)

    switch (true) {
      case Is.propertyDefined(responseMessage, 'error'):
        throw responseMessage.error
      case Is.propertyDefined(responseMessage, 'value'):
        return responseMessage.value
      default:
        return
    }

  }

  async send(message, awaitResponse = Is.string(message) ? false : true) {

    if (Is.string(message)) {
      return super.send(message)
    } else {

      let requestMessage = Is.propertyDefined(message, 'id') ? message : { 'id': await CreateMessageId(), ...message }

      if (awaitResponse) {
        await super.send(requestMessage)
        return this.whenMessage((responseMessage) => responseMessage.id === requestMessage.id)
      } else {
        return super.send(requestMessage)
      }

    }

  }

  exit(code = 0, force = false) {
    return Promise.all([this.whenExit(), this.send({ 'type': 'exit', 'code': code, 'force': force }, false)])
  }

  kill(signal = 'SIGINT') {
    return Promise.all([this.whenKill(), this.send(signal)])
  }

  async whenReady() {

    if (!this.isReady) {

      await this.whenMessage((message) => Is.equal(message.type, 'ready'))
      await this.send({ 'type': 'ready' }, false)

      this.isReady = true

    }

    return true

  }

  whenSpawn() {
    return super.whenSpawn(this.maximumDuration)
  }

  whenMessage(compareFn = () => true) {
    return super.whenMessage(compareFn, this.maximumDuration)
  }

  whenData(compareFn = () => true) {
    return super.whenData(compareFn, this.maximumDuration)
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

}

export { WorkerClient }