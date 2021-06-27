import { Is } from '@virtualpatterns/mablung-is';

class Handler {

  get(target, propertyName, receiver) {

    let returnValue = Reflect.get(target, propertyName, receiver);

    if (Is.not.string(propertyName) ||
    Is.primitive(returnValue)) {
      return returnValue;
    } else {
      return new Proxy(returnValue, this);
    }

  }

  async apply(target, self, parameter) {

    let returnValue = null;
    returnValue = Reflect.apply(target, self, parameter);
    returnValue = returnValue instanceof Promise ? await returnValue : returnValue;

    return Is.primitive(returnValue) ? returnValue : new Proxy(returnValue, this);

  }}



export { Handler };

//# sourceMappingURL=handler1.js.map