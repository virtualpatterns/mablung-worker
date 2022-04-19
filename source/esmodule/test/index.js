import { CreateRandomId } from '../library/create-random-id.js'
import { CreateLoggedProcess } from './library/create-logged-process.js'
import { ForkedProcess, SpawnedProcess, WorkerClient } from '../index.js'

const LoggedForkedProcess = CreateLoggedProcess(ForkedProcess)
const LoggedSpawnedProcess = CreateLoggedProcess(SpawnedProcess)
const LoggedWorkerClient = CreateLoggedProcess(WorkerClient)

export { CreateRandomId }
export { CreateLoggedProcess }
export { LoggedForkedProcess, LoggedSpawnedProcess, LoggedWorkerClient }
