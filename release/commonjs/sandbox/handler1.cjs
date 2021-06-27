"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Handler = void 0;

var _mablungIs = require("@virtualpatterns/mablung-is");

class Handler {
  get(target, propertyName, receiver) {
    let returnValue = Reflect.get(target, propertyName, receiver);

    if (_mablungIs.Is.not.string(propertyName) || _mablungIs.Is.primitive(returnValue)) {
      return returnValue;
    } else {
      return new Proxy(returnValue, this);
    }
  }

  async apply(target, self, parameter) {
    let returnValue = null;
    returnValue = Reflect.apply(target, self, parameter);
    returnValue = returnValue instanceof Promise ? await returnValue : returnValue;
    return _mablungIs.Is.primitive(returnValue) ? returnValue : new Proxy(returnValue, this);
  }

}

exports.Handler = Handler;

//# sourceMappingURL=handler1.cjs.map