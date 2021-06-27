import BaseChildProcess from 'child_process';

import { ChildProcess } from './child-process.js';

class ForkedProcess extends ChildProcess {

  constructor(path, parameter = {}, option = {}) {
    super(path, parameter, option);
  }

  _createProcess(path, parameter, option) {
    return BaseChildProcess.fork(path, parameter, option);
  }}



export { ForkedProcess };

//# sourceMappingURL=forked-process.js.map