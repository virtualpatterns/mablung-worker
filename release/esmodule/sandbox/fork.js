import { createRequire as _createRequire } from "module";import ChildProcess from 'child_process';
import { createRequire } from 'module';

const Process = process;
const Require = _createRequire(import.meta.url);

Process.on('exit', () => {
  console.log('PARENT Process.on(\'exit\', () => { ... })');
});

let childProcess = ChildProcess.fork(Require.resolve('./forked.js'), {
  // 'execArgv': [ '--inspect' ],
  'serialization': 'advanced',
  'stdio': 'inherit' });


// setTimeout(() => {
//   console.log('PARENT ChildProcess.send({ \'type\': \'ping\' })')
//   childProcess.send({ 'type': 'ping' })
//   childProcess.off('message', childProcess._onMessage)
// }, 5000)

childProcess.on('message', childProcess._onMessage = (message) => {
  console.log('PARENT ChildProcess.on(\'message\', childProcess._onMessage = (message) => { ... })');
  console.dir(message);
  childProcess.send({ 'type': 'end' }, (error) => {
    if (error) {
      console.error(error);
    } else {
      setTimeout(Process.exit, 5000);
      // childProcess.send({ 'type': 'end' }, (error) => {
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

//# sourceMappingURL=fork.js.map