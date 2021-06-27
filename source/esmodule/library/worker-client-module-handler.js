
const EXCLUDE_PROPERTY_NAME = [ 'then' ]

class WorkerClientModuleHandler {

  static get(target, propertyName) {

    if (!EXCLUDE_PROPERTY_NAME.includes(propertyName)) {
      return (function (...parameter) { return target.apply(propertyName, parameter) }).bind(target)
    } else {
      return undefined
    }

  }

}

export { WorkerClientModuleHandler } 