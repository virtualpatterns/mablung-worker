class NullHandler {

  static get(target) {
    return (function () {}).bind(target)
  }

}

export { NullHandler }