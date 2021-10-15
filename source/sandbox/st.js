import '@virtualpatterns/mablung-source-map-support/install'
import { Console, error } from 'console'
import FileSystem from 'fs'

const Process = process

async function main() {

  try {

    let stream = FileSystem.createWriteStream('data/sandbox/st.log', {
      'autoClose': false,
      'emitClose': true,
      'encoding': 'utf8',
      'flags': 'a+'
    })

    stream.once('open', () => {
      console.log('Stream.once(\'open\', () => { ... })')

      let _console = new Console({
        'colorMode': false,
        'ignoreErrors': false,
        'stderr': stream,
        'stdout': stream
      })

      _console.log(`${new Date()}`)

      stream.emit('error', new Error('you suck!'))

      console.log('Stream#close()')
      stream.close()

    })

    stream.once('close', () => {
      console.log('Stream#once(\'close\', () => { ... })')
    })

    stream.once('finish', () => {
      console.log('Stream#once(\'finish\', () => { ... })')
      // throw new Error('you suck!')
      // return Promise.reject(new Error('you suck!'))
    })

    stream.on('error', (error) => {
      console.error('Stream#on(\'error\', (error) => { ... }) 0')
      console.error(error)
    })

    stream.on('error', (error) => {
      console.error('Stream#on(\'error\', (error) => { ... }) 1')
      console.error(error)
    })

    Process.exitCode = 0

  } catch (error) {
    console.error(error)
    Process.exitCode = 1
  }

}

main()