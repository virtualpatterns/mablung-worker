const Process = process;

export function onImport(option = {}) {
  console.log('Worker.onImport(option) { ... }');
  console.dir(option);
  return Process.pid;
}

export function getPid(duration = 0) {

  if (duration) {

    return new Promise(resolve => {

      setTimeout(() => {
        /* c8 ignore next 1 */
        resolve(Process.pid);
      }, duration);

    });

  } else {
    return Process.pid;
  }

}

export function onRelease(option = {}) {
  console.log('Worker.onRelease(option) { ... }');
  console.dir(option);
  return Process.pid;
}

export function onEnd(option = {}) {
  console.log('Worker.onEnd(option) { ... }');
  console.dir(option);
  return Process.pid;
}
//# sourceMappingURL=worker.js.map