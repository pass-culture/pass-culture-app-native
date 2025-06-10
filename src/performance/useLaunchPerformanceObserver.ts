import perf from '@react-native-firebase/perf'
import { useEffect } from 'react'
import performance, { PerformanceObserver } from 'react-native-performance'

import { eventMonitoring } from 'libs/monitoring/services'
import { CustomMarks } from 'performance/CustomMarks'

export const useLaunchPerformanceObserver = (): void => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const isScreenInteractiveReady = list
        .getEntries()
        .find((entry) => entry.name === CustomMarks.SCREEN_INTERACTIVE)

      if (isScreenInteractiveReady) {
        const tti = performance.measure(
          CustomMarks.TIME_TO_INTERACTIVE,
          'nativeLaunchStart',
          CustomMarks.SCREEN_INTERACTIVE
        )

        if (__DEV__ || !tti.duration) {
          return
        } else {
          customTrace(tti.duration)
        }
      }
    })

    try {
      observer.observe({ type: 'mark', buffered: true })
    } catch (e) {
      eventMonitoring.captureException(`Error observing performance marks: ${String(e)}`)
    }

    return () => {
      observer.disconnect()
    }
  }, [])
}

enum CustomTrace {
  TTI_CONTAINER = 'home_time_to_interactive_container',
  TTI_IN_MS = 'home_time_to_interactive_in_ms',
}

async function customTrace(tti_in_ms: number) {
  const roundedDuration = Math.round(tti_in_ms)

  const trace = await perf().startTrace(CustomTrace.TTI_CONTAINER)

  trace.putMetric(CustomTrace.TTI_IN_MS, roundedDuration)

  await trace.stop()
}
