"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NullHandler = void 0;

class NullHandler {
  static get(target) {
    return function () {}.bind(target);
  }

}

exports.NullHandler = NullHandler;
//# sourceMappingURL=null-handler.cjs.map