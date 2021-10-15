import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Console } from 'console'
import { Is } from '@virtualpatterns/mablung-is'
import FileSystem from 'fs-extra'
import Path from 'path'
import Utility from 'util'

const Process = process

export function CreateLoggedProcess(processClass, userLogPath, userLogOption = {}, userConsoleOption = {}) {

  class ConsoleQueue {

    static queue = []

    /* c8 ignore start */
    static dir(...argument) {
      this.queue.push([ 'dir', argument ])
    }

    static error(...argument) {
      this.queue.push([ 'error', argument ])
    }

    static log(...argument) {
      this.queue.push([ 'log', argument ])
    }
    /* c8 ignore stop */

    static replay(_console = console) {
    
      let item = this.queue.shift()

      while (item) {

        let [ method, argument ] = item
        _console[method](...argument)

        item = this.queue.shift()

      }

    }

  }

  class LoggedProcess extends processClass {

    constructor(...argument) {
      super(...argument)

      try {

        let logPath = userLogPath
        let logOption = Configuration.getOption(this.defaultLogOption, userLogOption)

        let logStream = FileSystem.createWriteStream(logPath, logOption)

        logStream.once('open', () => {
          // console.log('Stream.once(\'open\', () => { ... })')
          this.isStreamError = false

          try {
            this.onLogOpen(logStream)
          } catch (error) {
            logStream.emit('error', error)
          }

        })

        logStream.once('close', () => {
          // console.log('Stream.once(\'close\', () => { ... })')

          try {
            this.onLogClose()
          } catch (error) {
            logStream.emit('error', error)
          }

        })

        logStream.on('error', (error) => {
          // console.error('Stream.on(\'error\', (error) => { ... })')
          this.onLogError(error, this.isStreamError)
        })

        ConsoleQueue.log('-'.repeat(50))

        this.stream = logStream
        this.isStreamError = true

        this.console = ConsoleQueue

      } catch (error) {

        ConsoleQueue.log('-'.repeat(50))
        ConsoleQueue.error(error)

        this.onLogOpen(Process.stdout)

      }

    }

    get defaultLogOption() {
      return {
        'autoClose': false,
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

      super.onSpawn()

    }

    onMessage(message) {

      this.console.log(`${processClass.name}.onMessage(message)`)
      this.console.dir(message)

      super.onMessage(message)

    }

    onExit(code) {

      this.console.log(`${processClass.name}.onExit(${code})`)

      if (this.stream instanceof FileSystem.WriteStream) { this.closeLog() }

      super.onExit(code)

    }

    onKill(signal) {

      this.console.log(`${processClass.name}.onKill('${signal}')`)

      if (this.stream instanceof FileSystem.WriteStream) { this.closeLog() }

      super.onKill(signal)

    }

    onError(error, isProcessError) {

      this.console.error(`${processClass.name}.onError(error, ${isProcessError})`)
      this.console.error(error)

      if (isProcessError && this.stream instanceof FileSystem.WriteStream) { this.closeLog() }

      super.onError(error)

    }

    send(message, awaitResponse = Is.string(message) ? false : true) {

      if (Is.string(message)) {
        this.console.log(`${processClass.name}.send('${message}')`)
      }

      return super.send(message, awaitResponse)

    }

    closeLog() {

      this.stderr.unpipe(this.stream)
      this.stdout.unpipe(this.stream)

      this.console = ConsoleQueue

      this.stream.close()

    }

    onLogOpen(stream) {

      let option = Configuration.getOption(this.defaultConsoleOption, userConsoleOption, { 'stderr': stream, 'stdout': stream })
      let _console = new Console(option)

      ConsoleQueue.replay(_console)

      this.stderr.pipe(stream, { 'end': false })
      this.stdout.pipe(stream, { 'end': false })

      this.stream = stream
      this.console = _console

    }

    onLogClose() {}

    onLogError(error, isStreamError) {

      if (isStreamError) {

        ConsoleQueue.error(`${processClass.name}.onLogError(error)`)
        ConsoleQueue.error(error)

        this.onLogOpen(Process.stdout)

      } else {

        this.console.error(`${processClass.name}.onLogError(error)`)
        this.console.error(error)

      }

    }

    async whenLogOpen() {

      let [ name, , ...argument ] = await this.whenLogEvent([ 'open', 'error' ])

      switch (name) {
        case 'open':
          return
        case 'error':
          throw argument[0]
      }

    }

    async whenLogClose() {

      let [ name, , ...argument ] = await this.whenLogEvent([ 'close', 'error' ])

      switch (name) {
        case 'close':
          return
        case 'error':
          throw argument[0]
      }

    }

    async whenLogError() {

      let [ , , ...argument ] = await this.whenLogEvent([ 'error' ])

      return argument[0]

    }

    whenLogEvent(name) {
      return processClass.whenEvent(this.stream, name, this.maximumDuration)
    }

  }

  return LoggedProcess

}
