
import { WorkerClientParameter } from './worker-client-parameter.js'

class WorkerPoolParameter {

  static getConstructorParameter(...parameter) {
    return WorkerClientParameter.getConstructorParameter(...parameter)
  }
  
}

export { WorkerPoolParameter }