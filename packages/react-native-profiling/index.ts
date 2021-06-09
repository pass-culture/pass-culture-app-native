// main index.js

import { NativeModules } from 'react-native'

const { Profiling } = NativeModules

interface ProfilingInterface {
  sampleMethod(
    stringArgument: string,
    numberArgument: number,
    callback: (message: string) => void
  ): void
}

export default Profiling as ProfilingInterface
