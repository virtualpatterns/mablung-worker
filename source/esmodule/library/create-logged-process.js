import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Console } from 'console'
import { Is } from '@virtualpatterns/mablung-is'
import FileSystem from 'fs-extra'
import Path from 'path'

export function CreateLoggedProcess(processClass, userLogPath, userLogOption = {}) {

  class LoggedProcess extends processClass {

    constructor(...argument) {
      super(...argument)
        
      let logPath = userLogPath
      let logOption = Configuration.getOption(this.defaultLogOption, userLogOption)

      let logStream = FileSystem.createWriteStream(logPath, logOption)

      this.stderr.pipe(logStream, { 'end': false })
      this.stdout.pipe(logStream, { 'end': false })

      this.console = new Console({
        'colorMode': false,
        'ignoreErrors': false,
        'stderr': logStream,
        'stdout': logStream
      })

    }

    get defaultLogOption() {
      return {
        'autoClose': true,
        'emitClose': true,
        'encoding': 'utf8',
        'flags': 'a+'
      }
    }

    onExecute(path, argument, option) {
      this.console.log(`${processClass.name}.onExecute('${Path.relative('', path)}', argument, option)`)
      this.console.dir(argument)
      this.console.dir(option)
      return super.onExecute(path, argument, option)
    }

    onMessage(message) {
      this.console.log(`${processClass.name}.onMessage(message)`)
      this.console.dir(message)
      return super.onMessage(message)
    }

    onExit(code) {
      this.console.log(`${processClass.name}.onExit(${code})`)
      return super.onExit(code)
    }

    onKill(signal) {
      this.console.log(`${processClass.name}.onKill('${signal}')`)
      return super.onKill(signal)
    }

    onError(error) {
      this.console.error(`${processClass.name}.onError(error)`)
      this.console.error(error)
      return super.onError(error)
    }

    send(message) {
      this.console.log(`${processClass.name}.send(${Is.string(message) ? `'${message}'` : 'message'})`)
      if (Is.not.string(message)) this.console.dir(message)
      return super.send(message)
    }

  }

  return LoggedProcess

}
