module.exports = function({ path }) {
  
  return {
    'failFast': true,
    'files': [
      'release/**/test/**/*.test.*'
    ],
    // 'nodeArguments': [
    //   '--unhandled-rejections=strict'
    // ],
    'require': [
      '@virtualpatterns/mablung-source-map-support/install'
    ],
    'verbose': true
  }

}
