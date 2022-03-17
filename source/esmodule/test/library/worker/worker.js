import { WorkerServer } from '@virtualpatterns/mablung-worker'
import SourceMapSupport from 'source-map-support'

SourceMapSupport.install({ 'handleUncaughtExceptions': false })

WorkerServer.start({})
