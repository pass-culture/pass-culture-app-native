import { InteractionManager } from 'react-native'
import performance from 'react-native-performance'

import { CustomMarks } from 'performance/CustomMarks'

export const markScreenInteractiveOnHomeLayout = () => {
  if (__DEV__) return
  InteractionManager.runAfterInteractions(() => {
    performance.mark(CustomMarks.SCREEN_INTERACTIVE)
  })
}
