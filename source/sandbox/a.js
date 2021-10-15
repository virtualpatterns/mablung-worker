import '@virtualpatterns/mablung-source-map-support/install'

const Process = process

async function main() {

  try {

    let a = [ 1, 2, 3 ]
    
    for (let item of a.reverse()) {
      console.log(`item = ${item}`)
    }
    

    Process.exitCode = 0

  } catch (error) {
    console.error(error)
    Process.exitCode = 1
  }

}

main()