import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { InteractionManager } from 'react-native'
import performance from 'react-native-performance'

import {
  performanceMonitoringStoreActions,
  useInitialScreenName,
  useWasPerformanceMarkedThisSession,
} from 'features/home/pages/helpers/usePerformanceMonitoringStore'
import { CustomMarks } from 'performance/CustomMarks'

export const useMarkScreenInteractive = () => {
  const initialScreenName = useInitialScreenName()
  const wasPerformanceMarkedThisSession = useWasPerformanceMarkedThisSession()
  const [hasFocusOfHomeBeenLost, setHasFocusOfHomeBeenLost] = useState(false)

  useFocusEffect(
    useCallback(() => {
      let interactionHandle

      const shouldMarkPerformance =
        !__DEV__ &&
        initialScreenName === 'TabNavigator' &&
        !wasPerformanceMarkedThisSession &&
        !hasFocusOfHomeBeenLost

      if (shouldMarkPerformance) {
        interactionHandle = InteractionManager.runAfterInteractions(() => {
          performance.mark(CustomMarks.SCREEN_INTERACTIVE)
          performanceMonitoringStoreActions.setWasPerformanceMarkedThisSession(true)
        })
      }

      return () => {
        if (interactionHandle) {
          interactionHandle.cancel()
          setHasFocusOfHomeBeenLost(true)
        }
      }
    }, [initialScreenName, wasPerformanceMarkedThisSession, hasFocusOfHomeBeenLost])
  )
}
