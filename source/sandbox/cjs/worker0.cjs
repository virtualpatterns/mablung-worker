const Process = process

const KEY = `worker-${Process.pid}`

export function getKey() {
  return KEY
}
