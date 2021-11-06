import { Console } from '@virtualpatterns/mablung-console'
import { Is } from '@virtualpatterns/mablung-is'
import Path from 'path'
import Utility from 'util'

const Process = process

export function CreateLoggedProcess(processClass, userLogPath, userLogOption = {}, userConsoleOption = {}) {

  class LoggedProcess extends processClass {

    constructor(...argument) {
      super(...argument)

      let logPath = userLogPath
      let logOption = userLogOption

      let consoleOption = userConsoleOption

      this.console = new Console(logPath, logOption, consoleOption)
      this.console.log('-'.repeat(50))

      this.stderr.pipe(this.console.stream, { 'end': false })
      this.stdout.pipe(this.console.stream, { 'end': false })

      let isSpawnError = true

      this.process.once('spawn', this.onceSpawnHandler = () => {
        delete this.onceSpawnHandler
        isSpawnError = false

        try {
          this.onSpawn()
        } catch (error) {
          this.process.emit('error', error)
        }

      })

      this.process.on('message', this.onMessageHandler = (message) => {

        try {
          this.onMessage(message)
        } catch (error) {
          this.process.emit('error', error)
        }

      })

      this.process.once('exit', this.onceExitHandler = (code, signal) => {
        delete this.onceExitHandler

        try {

          switch (true) {
            case Is.not.null(code):
              this.onExit(code)
              break
            case Is.not.null(signal):
              this.onKill(signal)
              break
            default:
              this.onExit(0)
          }

        } catch (error) {
          this.process.emit('error', error)
        }

      })

      this.process.on('error', this.onErrorHandler = (error) => {
        this.onError(error, isSpawnError)
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

    }

    onMessage(message) {

      this.console.log(`${processClass.name}.onMessage(message)`)
      this.console.dir(message)

    }

    onExit(code) {

      this.console.log(`${processClass.name}.onExit(${code})`)
      this.close()

    }

    onKill(signal) {

      this.console.log(`${processClass.name}.onKill('${signal}')`)
      this.close()

    }

    onError(error, isSpawnError) {

      this.console.error(`${processClass.name}.onError(error, ${isSpawnError})`)
      this.console.error(error)

      if (isSpawnError) { this.close() }

    }

    send(message, awaitResponse = Is.string(message) ? false : true) {

      if (Is.string(message)) {
        this.console.log(`${processClass.name}.send('${message}')`)
      }

      return super.send(message, awaitResponse)

    }

    close() {

      this.process.off('error', this.onErrorHandler)
      delete this.onErrorHandler

      if (this.onceExitHandler) {
        this.process.off('exit', this.onceExitHandler)
        delete this.onceExitHandler
      }

      this.process.off('message', this.onMessageHandler)
      delete this.onMessageHandler

      if (this.onceSpawnHandler) {
        this.process.off('spawn', this.onceSpawnHandler)
        delete this.onceSpawnHandler
      }

      this.stderr.unpipe(this.console.stream)
      this.stdout.unpipe(this.console.stream)

      this.console.close()
      
    }

  }

  return LoggedProcess

}
