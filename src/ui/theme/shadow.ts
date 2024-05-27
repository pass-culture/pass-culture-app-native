import colorAlpha from 'color-alpha'
import { Platform } from 'react-native'

import { ColorsEnum } from 'ui/theme'

type InputShadow = {
  shadowOffset: {
    width: number
    height: number
  }
  shadowRadius: number
  shadowColor: ColorsEnum | string
  shadowOpacity: number
}
type AndroidShadow = {
  // To avoid the following error:
  // WARN  Expected style "elevation: 2.2857142857142856px" to be unitless
  // https://github.com/styled-components/styled-components/issues/3254
  elevation: string
}
type IOSShadow = {
  shadowOffset: string
  shadowRadius: number
  shadowColor: ColorsEnum | string
  shadowOpacity: string
}
type WebShadow = { boxShadow?: string; filter?: string }

export function getShadow(
  shadowInput: InputShadow,
  dropShadow = false
): AndroidShadow | IOSShadow | WebShadow {
  if (Platform.OS === 'android') {
    // Elevation is implemented only for Android 5 and above
    if (Platform.Version < 5) {
      return {}
    }
    return { elevation: `${Number(shadowInput.shadowOffset.height) * 2}` }
  }
  if (Platform.OS === 'ios') {
    return {
      shadowOffset: `${shadowInput.shadowOffset.width}px ${shadowInput.shadowOffset.height}px`,
      shadowRadius: shadowInput.shadowRadius,
      shadowColor: shadowInput.shadowColor,
      shadowOpacity: shadowInput.shadowOpacity.toString(),
    }
  }
  const shadowColor = colorAlpha(shadowInput.shadowColor, shadowInput.shadowOpacity ?? 1)
  if (dropShadow) {
    return {
      filter: `drop-shadow(0px 2px 4px ${shadowColor})`,
    }
  } else {
    return {
      boxShadow: `${shadowInput.shadowOffset.width}px ${shadowInput.shadowOffset.height}px ${shadowInput.shadowRadius}px ${shadowColor}`,
    }
  }
}
