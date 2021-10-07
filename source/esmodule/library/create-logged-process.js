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
        
      let logConsoleOption = Configuration.getOption(this.defaultConsoleOption, userConsoleOption, { 'stderr': logStream, 'stdout': logStream })
      let logConsole = new Console(logConsoleOption)
        
      this.stream = logStream
      this.console = logConsole

      this._attach()

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

    _attach() {

      this.stream.on('error', this._onErrorHandler = (error) => {

        try {
          this.process.emit('error', error)
        } catch (error) {
          console.error(error)
        }

      })

      this.stream.once('close', this._onCloseHandler = () => {

        try {
          this._detach()
        } catch (error) {
          console.error(error)
        }

      })

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

    onError(error) {
      this.console.error(`${processClass.name}.onError(error)`)
      this.console.error(error)
      return super.onError(error)
    }

    async onExit(code) {
      this.console.log(`${processClass.name}.onExit(${code})`)
      await this._close()
      return super.onExit(code)
    }

    async onKill(signal) {
      this.console.log(`${processClass.name}.onKill('${signal}')`)
      await this._close()
      return super.onKill(signal)
    }

    send(message, awaitResponse = Is.string(message) ? false : true) {
      if (Is.string(message)) { this.console.log(`${processClass.name}.send('${message}')`) }
      return super.send(message, awaitResponse)
    }

    _close() {

      return new Promise((resolve, reject) => {

        this.stream.end((error) => {

          if (Is.nil(error)) {
            resolve()
          } else {
            reject(error)
          }

        })

      })

    }

    _detach() {

      if (this._onCloseHandler) {
        delete this._onCloseHandler
      }

      if (this._onErrorHandler) {
        this.stream.off('error', this._onErrorHandler)
        delete this._onErrorHandler
      }

    }

  }

  return LoggedProcess

}
