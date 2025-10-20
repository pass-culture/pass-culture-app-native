import { InteractionManager, Platform } from 'react-native'

export const runAfterInteractionsMobile = (callback: () => void) => {
  if (Platform.OS === 'web') {
    callback()
  } else {
    InteractionManager.runAfterInteractions(callback)
  }
}
