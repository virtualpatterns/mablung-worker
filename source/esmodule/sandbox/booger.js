

class WorkerServer {

  static publish(worker) {

    Object.defineProperty(this, 'worker', {
      'configurable': false,
      'enumerable': true,
      'get': () => worker
    })

  }

}

async function main() {

  try {

    await WorkerServer.publish({})
    await WorkerServer.publish({})

  } catch (error) {
    console.error(error)
  }

}

main()