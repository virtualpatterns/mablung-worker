import BaseChildProcess from 'child_process'

import { ChildProcess } from './child-process.js'

const { fork: Fork } = BaseChildProcess

class ForkedProcess extends ChildProcess {

  constructor(...argument) {
    super(...argument)
  }

  createProcess(path, argument, option) {
    return Fork(path, argument, option)
  }

}

export { ForkedProcess }