import colorAlpha from 'color-alpha'
import { Platform, ViewStyle } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

type InputShadow = {
  shadowOffset: {
    width: number
    height: number
  }
  shadowRadius: number
  shadowColor: ColorsEnum | string
  shadowOpacity: number
}
type AndroidShadow = Pick<ViewStyle, 'elevation'>
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
    return { elevation: Number(shadowInput.shadowOffset.height) * 2 }
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
