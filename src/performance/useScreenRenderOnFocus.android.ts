import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useRef } from 'react'
import { Platform } from 'react-native'

import { eventMonitoring } from 'libs/monitoring/services'

export const useScreenRenderOnFocus = (screenName: string) => {
  const screenTrace = useRef<FirebasePerformanceTypes.ScreenTrace | null>(null)
  useFocusEffect(
    useCallback(() => {
      const startTrace = async () => {
        try {
          const trace = await perf().startScreenTrace(screenName)
          screenTrace.current = trace
        } catch (e) {
          // startScreenTrace Throws if hardware acceleration is disabled or if Android is 8.0 or 8.1 as specified in doc: https://rnfirebase.io/perf/usage#custom-screen-traces
          if (Platform.OS === 'android' && ![26, 27].includes(Platform.Version))
            eventMonitoring.captureException(e)
        }
      }

      startTrace()

      return () => {
        screenTrace.current?.stop()
        screenTrace.current = null
      }
    }, [screenName])
  )
}
