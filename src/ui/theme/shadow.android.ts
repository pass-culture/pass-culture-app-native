import { Platform } from 'react-native'

import { AndroidShadow, ShadowInput } from './shadow.d'

export function getShadow(shadowInput: ShadowInput): AndroidShadow {
  // Elevation is implemented only for Android 5 and above
  if (Platform.Version < 5) {
    return {}
  }
  const elevation = Number(shadowInput.shadowOffset.height) * 2
  return { elevation: elevation }
}

export function getNativeShadow(shadowInput: ShadowInput): AndroidShadow | undefined {
  return getShadow(shadowInput)
}

export function getAnimatedNativeShadow(shadowInput: ShadowInput): AndroidShadow | undefined {
  return { elevation: shadowInput.shadowOpacity }
}
