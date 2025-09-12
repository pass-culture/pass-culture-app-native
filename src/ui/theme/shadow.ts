import { Platform } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type InputShadow = {
  shadowOffset: {
    width: number
    height: number
  }
  shadowRadius: number
  shadowColor: ColorsEnum | string
}
type AndroidShadow = {
  // To avoid the following error:
  // WARN  Expected style "elevation: 2.2857142857142856px" to be unitless
  // https://github.com/styled-components/styled-components/issues/3254
  elevation: number
}
type IOSShadow = {
  shadowOffset: { width: number; height: number }
  shadowRadius: number
  shadowColor: ColorsEnum | string
  shadowOpacity: number
}
type WebShadow = { boxShadow?: string; filter?: string }

function buildShadow(
  shadowInput: InputShadow,
  dropShadow = false
): AndroidShadow | IOSShadow | WebShadow {
  if (Platform.OS === 'android') {
    // Elevation is implemented only for Android 5 and above
    if (Platform.Version < 5) {
      return {}
    }
    return { elevation: shadowInput.shadowOffset.height * 2 }
  }
  if (Platform.OS === 'ios') {
    return {
      shadowOffset: {
        width: shadowInput.shadowOffset.width,
        height: shadowInput.shadowOffset.height,
      },
      shadowRadius: shadowInput.shadowRadius,
      shadowColor: shadowInput.shadowColor,
      shadowOpacity: 1, // We keep value at 1 because alpha is already included in the color token
    }
  }

  const shadowX = shadowInput.shadowOffset.width
  const shadowY = shadowInput.shadowOffset.height
  const shadowBlur = shadowInput.shadowRadius
  const shadowColor = shadowInput.shadowColor

  if (dropShadow) {
    return { filter: `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor})` }
  }
  return { boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}` }
}

function buildThemeShadowInput(theme: DefaultTheme): InputShadow {
  return {
    shadowOffset: {
      width: theme.designSystem.size.spacing.xxs,
      height: theme.designSystem.size.spacing.m,
    },
    shadowRadius: theme.designSystem.size.spacing.xxl,
    shadowColor: theme.designSystem.color.background.shadowOverlay,
  }
}

export function getShadow(theme: DefaultTheme) {
  return buildShadow(buildThemeShadowInput(theme))
}
