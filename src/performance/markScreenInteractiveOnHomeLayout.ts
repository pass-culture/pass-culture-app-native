import { InteractionManager } from 'react-native'
import performance from 'react-native-performance'

import { CustomMarks } from 'performance/CustomMarks'

export const markScreenInteractiveOnHomeLayout = () => {
  InteractionManager.runAfterInteractions(() => {
    performance.mark(CustomMarks.SCREEN_INTERACTIVE)
  })
}
