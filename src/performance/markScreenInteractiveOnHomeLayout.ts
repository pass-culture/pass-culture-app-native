import { InteractionManager } from 'react-native'
import performance from 'react-native-performance'

import { CustomMarks } from 'performance/CustomMarks'

export const markScreenInteractiveOnHomeLayout = (initialScreenName: string | undefined) => {
  if (__DEV__ || initialScreenName !== 'TabNavigator') return // second condition to prevent tti if user went through OnboardingStackNavigator (or other screen)
  InteractionManager.runAfterInteractions(() => {
    performance.mark(CustomMarks.SCREEN_INTERACTIVE)
  })
}
