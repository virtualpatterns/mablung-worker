import EventEmitter from 'events'

class Booger extends EventEmitter {

  constructor() {
    super()
  }

}

async function main() {

  try {

    let booger = new Booger()

    booger.on('message', (message) => {
      console.log('booger.on(\'message\', (message) => { ... })')
      console.dir(message)
      booger.emit('error', new Error('You suck!'))
    })

    booger.on('error', (error) => {
      console.log('booger.on(\'error\', (error) => { ... })')
      console.error(error)
    })

    booger.emit('message', { 'a': 1 })
    console.log('done')

  } catch (error) {
    console.log('catch (error) { ... }')
    console.error(error)
  }

}

main()