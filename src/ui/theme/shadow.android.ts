import { Platform } from 'react-native'

import { AndroidShadow, iOSShadowInput } from './shadow.d'

export function getShadow(shadowInput: iOSShadowInput): AndroidShadow | undefined {
  // Elevation is implemented only for Android 5 and above
  if (Platform.Version < 5) {
    return undefined
  }
  const elevation = shadowInput.shadowOffset.height * 2
  return { elevation: elevation.toString() }
}
