
import { LoggedClient } from '../test/library/logged-client.js'

const Require = __require

async function main() {

  try {

    let worker = new LoggedClient()

    try {

      await worker.import(Require.resolve('../test/library/worker.js'))

      try {
        // do nothing
      } finally {
        // await worker.release()
      }

    } finally {
      await worker.end()
    }
      
  } catch (error) {
    console.error(error)
  }

}

main()
