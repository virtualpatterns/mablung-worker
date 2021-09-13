
const EXCLUDE_PROPERTY_NAME = [ 'then' ]

class WorkerClientHandler {

  static get(target, propertyName) {

    if (!EXCLUDE_PROPERTY_NAME.includes(propertyName)) {
      return ( function (...argument) { return target.send({ 'type': 'call', 'methodName': propertyName, 'argument': argument }) } ).bind(target)
    } else {
      return undefined
    }

  }

}

export { WorkerClientHandler } 