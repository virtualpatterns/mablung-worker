import Is from '@pwn/is'

const EXCLUDE_PROPERTY_NAME = [ 'then' ]

class WorkerClientHandler {

  static get(target, propertyName, receiver) {

    let returnValue = null
    returnValue = Reflect.get(target, propertyName, receiver)

    if (Is.not.undefined(returnValue)) {
      return returnValue
      /* c8 ignore next 5 */
    } else if (!EXCLUDE_PROPERTY_NAME.includes(propertyName)) {
      return (function (...parameter) { return target.apply(propertyName, parameter) }).bind(target)
    } else {
      return undefined
    }

  }

}

export { WorkerClientHandler } 