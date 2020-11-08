import { NullHandler } from './null-handler.js';

class Null {

  constructor() {
    return new Proxy(this, NullHandler);
  }}



export { Null };
//# sourceMappingURL=null.js.map