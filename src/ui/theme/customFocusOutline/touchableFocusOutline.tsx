// eslint-disable-next-line no-restricted-imports
import { isFirefox, isSafari } from 'react-device-detect'
import { Platform } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

const defaultFocus = {
  outlineOffset: 0,
}
const firefoxFocus = {
  outlineOffset: '-2px',
}
const safariFocus = {
  outlineOffset: '-3px',
}

const focusStyle = () => {
  if (isFirefox) return firefoxFocus
  if (isSafari) return safariFocus
  return defaultFocus
}

export const touchableFocusOutline = (theme: DefaultTheme, isFocus?: boolean) =>
  Platform.OS === 'web' && isFocus ? { ...focusStyle(), outlineColor: theme.colors.accent } : {}
