// main index.ts

import { NativeModules } from 'react-native'

const { Profiling } = NativeModules

interface ProfilingInterface {
  profileDevice(strDevice: string, callback: (cb: string) => void): void
}

export default Profiling as ProfilingInterface
