"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndex = getIndex;
const Process = process;

function getIndex() {
  return Process.env.WORKER_POOL_INDEX ? parseInt(Process.env.WORKER_POOL_INDEX) : 0;
}
//# sourceMappingURL=worker1.cjs.map