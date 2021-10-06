const Process = process
 
Process.once('beforeExit', (code) => {
  console.log(`beforeExit code=${code}`)

  setTimeout(() => {
    console.log('beforeExit timeout')
  }, 5000)

})

Process.once('exit', (code) => {
  console.log(`exit code=${code}`)

  setTimeout(() => {
    console.log('exit timeout')
  }, 5000)

})

async function main() {

  try {

    console.log('done')
    Process.exitCode = 1

  } catch (error) {
    console.error(error)
    Process.exitCode = 1
  }

}

main()