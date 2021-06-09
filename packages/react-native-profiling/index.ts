// main index.js

import { NativeModules } from 'react-native'

const { Profiling } = NativeModules

interface ProfilingInterface {
  profileDevice(orgId: string, fpServer: string, callback: (sessionId: string) => void): void
}

export default Profiling as ProfilingInterface
