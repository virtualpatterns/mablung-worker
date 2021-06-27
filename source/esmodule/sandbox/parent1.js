import { WorkerServer } from '../library/worker-server.js'

;(async () => {

  try {
    new WorkerServer()
  } catch (error) {
    console.error(error)
  }

})()
