import { Is } from '@virtualpatterns/mablung-is'

const Require = __require

class WorkerClientParameter {

  static getConstructorParameter(...parameter) {

    // the defaults
    let _path = Require.resolve('./create-worker-server.js')
    let _parameter = {}
    let _option = {}

    switch (parameter.length) {
      case 0:
        // _path = default
        // _parameter = default
        // _option = default
        break
      case 1:

        switch (true) {
          case Is.string(parameter[0]):
            // _path = default
            _parameter = { '--import-path': parameter[0] }
            // _option = default
            break
          default:
            // _path = default
            // _parameter = default
            _option = parameter[0]
        }

        break
      case 2:

        switch (true) {
          case Is.string(parameter[0]):
            // _path = default
            _parameter = { '--import-path': parameter[0] }
            _option = parameter[1]
            break
          default:
            // _path = default
            _parameter = parameter[0]
            _option = parameter[1]
        }

        break
      default:
        _path = parameter[0]
        _parameter = parameter[1]
        _option = parameter[2]
    }

    return [ _path, _parameter, _option ]

  }
  
}

export { WorkerClientParameter }