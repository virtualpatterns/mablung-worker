// import Path from 'path'
import URL from 'url'

// const Process = process

;(async () => {

  try {

    let abc = 1

    // const { Resolve } = await import('../../library/resolve.js')

    // console.log(`Process.cwd()='${Process.cwd()}'`)
    // console.log(`Resolve='${await Resolve('../handler1.js')}'`)
    // console.log(`require.resolve='${require.resolve('../handler1.js')}'`)
    // console.log(`Path.resolve='${Path.resolve('../handler1.js')}'`)

    console.log(`__FILEURL__='${__FILEURL__}'`)
    // console.log(`URL.fileURLToPath='${URL.fileURLToPath(__FILEURL__)}'`)
    // console.log(`Path.dirname='${Path.dirname(URL.fileURLToPath(__FILEURL__))}'`)

  } catch (error) {
    console.error(error)
  }

})()
