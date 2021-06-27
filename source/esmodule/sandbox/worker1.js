
const Process = process

export function getIndex() {
  return Process.env.WORKER_POOL_INDEX ? parseInt(Process.env.WORKER_POOL_INDEX) : 0
}
