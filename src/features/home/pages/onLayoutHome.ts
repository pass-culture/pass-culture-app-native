import perf from '@react-native-firebase/perf'
import { InteractionManager } from 'react-native'
import performance from 'react-native-performance'

export function onLayoutHome() {
  InteractionManager.runAfterInteractions(async () => {
    performance.mark('screenInteractive')
    performance.measure('timeToInteractive', 'nativeLaunchStart', 'screenInteractive')

    const tti = performance.getEntriesByName('timeToInteractive')
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(tti, null, 2))

    const trace = await perf().startTrace('tti_container')
    if (tti[0]?.duration) {
      const roundedDuration = Math.round(tti[0]?.duration)
      trace.putMetric('tti', roundedDuration)
      // eslint-disable-next-line no-console
      console.log(tti[0]?.duration)
    }

    await trace.stop()
  })
}
