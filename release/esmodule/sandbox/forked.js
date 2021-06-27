import { Configuration } from '@virtualpatterns/mablung-configuration';
import { Console } from 'console';
import FileSystem from 'fs';

const Process = process;

let outputStream = null;
outputStream = FileSystem.createWriteStream('./forked.out', { 'encoding': 'utf8' });

let errorStream = null;
errorStream = FileSystem.createWriteStream('./forked.err', { 'encoding': 'utf8' });

let _console = new Console({
  'colorMode': false,
  'ignoreErrors': false,
  'stderr': errorStream,
  'stdout': outputStream });


Process.on('uncaughtException', (error) => {
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

Process.on('message', _onMessage = (message) => {
  _console.log('CHILD Process.on(\'message\', _onMessage = (message) => { ... })');
  _console.dir(message);

  Process.off('message', _onMessage);
  _onMessage = null;

  setTimeout(() => {
    Process.exit();
  }, 2500);

});

//# sourceMappingURL=forked.js.map