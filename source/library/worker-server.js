import { Configuration } from '@virtualpatterns/mablung-configuration'
import { Is } from '@virtualpatterns/mablung-is'
import DefaultChangeCase, * as ModuleChangeCase from 'change-case'
import URL from 'url'

import { WorkerServerNoIPCChannelError } from './error/worker-server-no-ipc-channel-error.js'

const { 'pascalCase': PascalCase } = DefaultChangeCase || ModuleChangeCase
const Process = process

class WorkerServer {

  constructor(userOption = {}) {

    this._option = Configuration.getOption(this.defaultOption, userOption)

    this._module = null
    this._modulePath = null

    this._attach()

  }

  get defaultOption() {
    return { 'readyInterval': 1000 }
  }

  _attach() {

    Process.on('message', this.__onMessage = async (message) => {
      // console.log('WorkerServer.on(\'message\', this.__onMessage = async (message) => { ... })')
      // console.dir(message)

      try {
        this._detachReadyInterval()   
        await this._onMessage(message) 
      /* c8 ignore next 3 */
      } catch(error) {
        console.error(error)
      }

    })

    Process.on('disconnect', this.__onDisconnect = () => {
      // console.log('WorkerServer.on(\'disconnect\', this.__onDisconnect = () => { ... })')

      try {
        this._detachReadyInterval()   
        this._detachDisconnect()    
      /* c8 ignore next 3 */
      } catch(error) {
        console.error(error)
      }
      
    })

    Process.on('exit', this.__onExit = (code) => {
      // console.log(`WorkerServer.on('exit', this.__onExit = (${code}) => { ... })`)

      try {
        this._detach()
      /* c8 ignore next 3 */
      } catch(error) {
        console.error(error)
      }
        
    })

    this._readyInterval = setInterval(async () => {

      try {
        await this.send({ 'type': 'ready' })
      /* c8 ignore next 4 */
      } catch (error) {
        this._detachReadyInterval()
        console.error(error)
      }

    }, this._option.readyInterval)

  }

  _detachReadyInterval() {

    if (this._readyInterval) {
      clearInterval(this._readyInterval)
      delete this._readyInterval
    }

  }

  _detachDisconnect() {

    if (this.__onDisconnect) {
      Process.off('disconnect', this.__onDisconnect)
      delete this.__onDisconnect
    }

  }

  _detach() {

    this._detachReadyInterval()    

    if (this.__onExit) {
      Process.off('exit', this.__onExit)
      delete this.__onExit
    }

    this._detachDisconnect()

    if (this.__onMessage) {
      Process.off('message', this.__onMessage)
      delete this.__onMessage
    }

  }

  async import(path) {

    let module = null
    module = await import(path) // URL.pathToFileURL(path))
    module = module.default || module

    this._module = module
    this._modulePath = path

  }

  send(message) {
    // console.log('WorkerServer.send(message) { ... }')
    // console.dir(message)

    return new Promise((resolve, reject) => {

      if (Process.send) {

        Process.send(message, (error) => {

          if (Is.null(error)) {
            resolve()
          /* c8 ignore next 3 */
          } else {
            reject(error)
          }

        })

      /* c8 ignore next 3 */
      } else {
        reject(new WorkerServerNoIPCChannelError())
      }

    })

  }

  _onMessage(message) {
    let methodName = `_on${PascalCase(message.type)}`
    return this[methodName](message)
  }

  async _onPing(message) {

    let cpuUsage = null
    cpuUsage = Process.cpuUsage()
    cpuUsage = (cpuUsage.user + cpuUsage.system) / 2.0

    message.returnValue = { 'index': Process.env.WORKER_POOL_INDEX ? parseInt(Process.env.WORKER_POOL_INDEX) : 0, 'pid': Process.pid, 'cpuUsage': cpuUsage }

    await this.send(message)

  }

  async _onApply(message) {

    try {

      let returnValue = null
      returnValue = this._module[message.methodName].apply(this._module, message.parameter)
      returnValue = returnValue instanceof Promise ? await returnValue : returnValue

      delete message.error
      message.returnValue = returnValue

    } catch (error) {

      message.error = error
      delete message.returnValue

    }

    await this.send(message)

  }

  async _onExit(message) {

    try {
      Process.exit(message.code || 0)
    /* c8 ignore next 3 */
    } catch (error) {
      console.error(error)
    }

  }

}

export default WorkerServer