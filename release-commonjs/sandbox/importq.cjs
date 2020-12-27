"use strict";

require("@virtualpatterns/mablung-source-map-support/install");

var ModuleChangeCase = _interopRequireWildcard(require("change-case"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import DefaultBundle, * as ModuleBundle from 'esbuild'
// import DefaultTraverse, * as ModuleTraverse from '@babel/traverse'
// const { 'build': Bundle } = DefaultBundle || ModuleBundle
// const { 'default': Traverse } = DefaultTraverse || ModuleTraverse
debugger;
const {
  'pascalCase': PascalCase
} = ModuleChangeCase.default || ModuleChangeCase;

async function main() {
  try {
    console.log('Hello, world!');
  } catch (error) {
    console.error(error);
  }
}

main();
//# sourceMappingURL=importq.cjs.map