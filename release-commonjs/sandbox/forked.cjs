"use strict";

var _mablungConfiguration = require("@virtualpatterns/mablung-configuration");

var _console2 = require("console");

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Process = process;
let outputStream = null;
outputStream = _fs.default.createWriteStream('./forked.out', {
  'encoding': 'utf8'
});
let errorStream = null;
errorStream = _fs.default.createWriteStream('./forked.err', {
  'encoding': 'utf8'
});

let _console = new _console2.Console({
  'colorMode': false,
  'ignoreErrors': false,
  'stderr': errorStream,
  'stdout': outputStream
});

Process.on('uncaughtException', error => {
  _console.error('CHILD Process.on(\'uncaughtException\', (error) => { ... })');

  _console.error(error);
});
Process.on('exit', () => {
  _console.log('CHILD Process.on(\'exit\', () => { ... })');

  _console.error('CHILD Process.on(\'exit\', () => { ... })');

  outputStream.close();
  errorStream.close();
});

_console.log('HELO');

_console.dir(Process.argv);

_console.error('HELO');

let _onMessage = null;
Process.on('message', _onMessage = message => {
  _console.log('CHILD Process.on(\'message\', _onMessage = (message) => { ... })');

  _console.dir(message);

  Process.off('message', _onMessage);
  _onMessage = null;
  setTimeout(() => {
    Process.exit();
  }, 2500);
});
//# sourceMappingURL=forked.cjs.map