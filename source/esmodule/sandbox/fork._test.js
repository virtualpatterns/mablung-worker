// import ChildProcess from 'child_process'
// import Test from 'ava'

// const Require = __require // __require is replaced by @virtualpatterns/babel-plugin-mablung-replace

// Test('...', (test) => {

//   let childProcess = ChildProcess.fork(Path.resolve(FolderPath, 'forked.js'), [], { 'execPath': '/abc' })

//   childProcess.on('error', (error) => {
//     console.error('childProcess.on(\'error\', (error) => { ... })')
//     console.error(error)
//   })

//   childProcess.on('exit', () => {
//     console.log('childProcess.on(\'exit\', () => { ... })')
//   })

//   test.truthy(childProcess.pid)

//   return new Promise((resolve/* , reject */) => {
//     setTimeout(() => {
//       resolve()
//       // childProcess.send({ 'type': 'end' }, (error) => {
//       //   if (error) {
//       //     reject(error)
//       //   } else {
//       //     resolve()
//       //   }
//       // })
//     }, 2500)
    
//   })

// })
