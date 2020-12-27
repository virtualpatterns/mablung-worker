"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Null = void 0;

var _nullHandler = require("./null-handler.cjs");

class Null {
  constructor() {
    return new Proxy(this, _nullHandler.NullHandler);
  }

}

exports.Null = Null;
//# sourceMappingURL=null.cjs.map