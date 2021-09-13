import BaseChildProcess from 'child_process'

import { ChildProcess } from './child-process.js'

const { spawn: Spawn } = BaseChildProcess

class SpawnedProcess extends ChildProcess {

  constructor(...argument) {
    super(...argument)
  }

  createProcess(path, argument, option) {
    return Spawn(path, argument, option)
  }

}

export { SpawnedProcess }