import { Is } from '@virtualpatterns/mablung-is'

const EXCLUDE_PROPERTY_NAME = [ 'then' ]

class WorkerClientHandler {

  static get(target, name) {

    if (!EXCLUDE_PROPERTY_NAME.includes(name)) {

      return (async function (...argument) {

        let requestMessage = { 'type': 'call', 'name': name, 'argument': argument }
        let responseMessage = await target.send(requestMessage, true)

        switch (true) {
          case Is.propertyDefined(responseMessage, 'error'):
            throw responseMessage.error
          case Is.propertyDefined(responseMessage, 'value'):
            return responseMessage.value
          default:
            return
        }

      }).bind(target)

    } else {
      return undefined
    }

  }

}

export { WorkerClientHandler } 