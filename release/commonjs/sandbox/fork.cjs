"use strict";

var _child_process = _interopRequireDefault(require("child_process"));

var _module = require("module");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Process = process;
const Require = require;
Process.on('exit', () => {
  console.log('PARENT Process.on(\'exit\', () => { ... })');
});

let childProcess = _child_process.default.fork(Require.resolve("./forked.cjs"), {
  // 'execArgv': [ '--inspect' ],
  'serialization': 'advanced',
  'stdio': 'inherit'
}); // setTimeout(() => {
//   console.log('PARENT ChildProcess.send({ \'type\': \'ping\' })')
//   childProcess.send({ 'type': 'ping' })
//   childProcess.off('message', childProcess._onMessage)
// }, 5000)


childProcess.on('message', childProcess._onMessage = message => {
  console.log('PARENT ChildProcess.on(\'message\', childProcess._onMessage = (message) => { ... })');
  console.dir(message);
  childProcess.send({
    'type': 'end'
  }, error => {
    if (error) {
      console.error(error);
    } else {
      setTimeout(Process.exit, 5000); // childProcess.send({ 'type': 'end' }, (error) => {
      //   if (error) {
      //     console.error(error)
      //   } else {
      //     Process.exit()
      //   }
      // })
    }
  });
});
childProcess.on('exit', childProcess._onExit = () => {
  console.log('PARENT ChildProcess.on(\'exit\', childProcess._onExit = () => { ... })');
});

//# sourceMappingURL=fork.cjs.map