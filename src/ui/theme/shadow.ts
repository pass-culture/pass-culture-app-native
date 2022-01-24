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
type WebShadow = { boxShadow: string }

export function getShadow(shadowInput: InputShadow): AndroidShadow | IOSShadow | WebShadow {
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
  return {
    boxShadow: `${shadowInput.shadowOffset.width}px ${shadowInput.shadowOffset.height}px ${shadowInput.shadowRadius}px ${shadowInput.shadowColor}`,
  }
}
