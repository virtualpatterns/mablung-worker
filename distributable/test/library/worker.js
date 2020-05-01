const Process = process;

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
//# sourceMappingURL=worker.js.map