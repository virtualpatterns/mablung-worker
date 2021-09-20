import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Console } from 'console'
import FileSystem from 'fs-extra'
import Path from 'path'
import Utility from 'util'

export function CreateLoggedProcess(processClass, userLogPath, userLogOption = {}, userConsoleOption = {}) {

  class LoggedProcess extends processClass {

    constructor(...argument) {
      super(...argument)
        
      let logPath = userLogPath
      let logOption = Configuration.getOption(this.defaultLogOption, userLogOption)

      let logStream = FileSystem.createWriteStream(logPath, logOption)

      this.stderr.pipe(logStream, { 'end': false })
      this.stdout.pipe(logStream, { 'end': false })
        
      let consoleOption = Configuration.getOption(this.defaultConsoleOption, userConsoleOption)
      
      consoleOption.stderr = logStream
      consoleOption.stdout = logStream
        
      this.console = new Console(consoleOption)

    }

    get defaultLogOption() {
      return {
        'autoClose': true,
        'emitClose': true,
        'encoding': 'utf8',
        'flags': 'a+'
      }
    }

    get defaultConsoleOption() {
      return {
        'colorMode': false,
        'ignoreErrors': false
      }
    }

    onSpawn() {
      this.console.log(`${processClass.name}.onSpawn() processPath = '${Path.relative('', this.processPath)}' processArgument = ${Utility.format(this.processArgument)} processOption = ${Utility.format(this.processOption)}`)
      return super.onSpawn()
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

    // send(message) {
    //   this.console.log(`${processClass.name}.send(${Is.string(message) ? `'${message}'` : 'message'})`)
    //   if (Is.not.string(message)) this.console.dir(message)
    //   return super.send(message)
    // }

  }

  return LoggedProcess

}
