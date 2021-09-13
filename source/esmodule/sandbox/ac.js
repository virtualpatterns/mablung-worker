let begin = process.hrtime.bigint()
setTimeout(() => {
  let end = process.hrtime.bigint()
  let duration = parseInt((end - begin) / BigInt(1e6))
  console.log(`${duration}ms ${typeof end}`)
}, 1000)
