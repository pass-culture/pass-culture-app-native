/* eslint-disable no-console */
import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useRef } from 'react'

export const useScreenRenderOnFocus = (screenName: string) => {
  const screenTrace = useRef<FirebasePerformanceTypes.ScreenTrace | null>(null)
  useFocusEffect(
    useCallback(() => {
      const startTrace = async () => {
        try {
          const trace = await perf().startScreenTrace(screenName)
          screenTrace.current = trace
          console.log({ trace })
        } catch (e) {
          console.log({ screenName, e })
        }
      }

      startTrace()

      return () => {
        screenTrace.current?.stop()
        screenTrace.current = null
        console.log('UNMOUNTING')
      }
    }, [screenName])
  )
}
