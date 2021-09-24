import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Console } from 'console'
import { Is } from '@virtualpatterns/mablung-is'
import FileSystem from 'fs-extra'
import Path from 'path'
import Utility from 'util'

const Process = process

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

      let processPath = this.processPath

      if (processPath.includes(Process.cwd())) {
        processPath = Path.relative('', processPath)
      }

      let processArgument = Utility.format(this.processArgument)
      let processOption = Utility.format(this.processOption)

      this.console.log(`${processClass.name}.onSpawn() processPath = '${processPath}' processArgument = ${processArgument.includes('\n') ? '...' : processArgument} processOption = ${processOption.includes('\n') ? '...' : processOption}`)

      if (processArgument.includes('\n')) {
        this.console.log(processArgument)
      }

      if (processOption.includes('\n')) {
        this.console.log(processOption)
      }

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

    send(message, awaitResponse = Is.string(message) ? false : true) {
      if (Is.string(message)) this.console.log(`${processClass.name}.send('${message}', ...)`)
      return super.send(message, awaitResponse)
    }

  }

  return LoggedProcess

}
