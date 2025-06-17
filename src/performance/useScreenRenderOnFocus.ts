import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useRef } from 'react'
import { Platform } from 'react-native'

import { eventMonitoring } from 'libs/monitoring/services'

export enum ScreenPerformance {
  HOME = 'HomeOnlineScreen',
  PROFILE = 'ProfileOnlineScreen',
  SEARCH = 'SearchOnlineScreen',
  THEMATIC_HOME = 'ThematicHomeScreen',
  LOGIN = 'LoginScreen',
}

export const useScreenRenderOnFocus = (screenName: string) => {
  const screenTrace = useRef<FirebasePerformanceTypes.ScreenTrace | null>(null)
  useFocusEffect(
    useCallback(() => {
      const startTrace = async () => {
        try {
          const trace = await perf().startScreenTrace(screenName)
          screenTrace.current = trace
        } catch (e) {
          // startScreenTrace Throws if hardware acceleration is disabled (by default active on AndroidManifest) or if Android is 9.0 or 9.1.
          if (Platform.OS === 'android' && Platform.Version !== 28)
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
