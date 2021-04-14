"use strict";

require("@virtualpatterns/mablung-source-map-support/install");

var _commander = _interopRequireDefault(require("commander"));

var _fs = _interopRequireDefault(require("fs"));

var _json = _interopRequireDefault(require("json5"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import URL from 'url'
// import Utilities from 'util'
const Process = process;
const Require = require;

const Package = _json.default.parse(_fs.default.readFileSync(Require.resolve('../../package.json'), {
  'encoding': 'utf-8'
}));

(async () => {
  console.log(Require.resolve("./worker-server.cjs"));

  _commander.default.version(Package.version);

  _commander.default.option('--worker-server-class-path <path>', 'Path to the server class to import/create', Require.resolve("./worker-server.cjs"));

  _commander.default.option('--import-path <path>', 'Path to the module to import', Require.resolve("./worker.cjs"));

  _commander.default.parse(Process.argv); // console.log('-'.repeat(80))
  // console.log(`Process.version               = '${Process.version}'`)
  // console.log(`Package.version               = 'v${Package.version}'`)
  // console.log(`Process.argv[0]               = '${Process.argv[0]}'`)
  // console.log(`Process.execArgv              = ${Utilities.inspect(Process.execArgv)}`)
  // console.log(`Process.argv[1]               = '${Path.relative(Process.cwd(), Process.argv[1])}'`)
  // console.log(`Command.opts().workerServerClassPath = '${Path.relative(Process.cwd(), Command.opts().workerServerClassPath)}'`)
  // console.log(`Command.opts().importPath            = '${Path.relative(Process.cwd(), Command.opts().importPath)}'`)


  let workerServerClass = null;
  workerServerClass = await Promise.resolve(`${_commander.default.opts().workerServerClassPath}`).then(s => _interopRequireWildcard(require(s))); // URL.pathToFileURL(Command.opts().workerServerClassPath))

  workerServerClass = workerServerClass.default || workerServerClass; // console.log(`workerServerClass.name        = ${workerServerClass.name}`)
  // console.log('-'.repeat(80))

  await new workerServerClass().import(_commander.default.opts().importPath);
})();
//# sourceMappingURL=create-worker-server.cjs.map