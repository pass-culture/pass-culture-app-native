// eslint-disable-next-line no-restricted-imports
import { isSafari, browserVersion } from 'react-device-detect'
import { Platform } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

// Added support for the :focus-visible pseudo-class starting with Safari 15.4 (https://caniuse.com/css-focus-visible)
const focus = isSafari && Number(browserVersion) < 15.4 ? '&:focus' : '&:focus-visible'

export function customFocusOutline(theme: DefaultTheme, color?: ColorsEnum, isFocus?: boolean) {
  const outlineRules = {
    outlineColor: color ?? theme.outline.color,
    outlineWidth: theme.outline.width,
    outlineStyle: theme.outline.style,
    outlineOffset: theme.outline.offSet,
  }

  const outlineFocusWeb = isFocus
    ? outlineRules
    : {
        [focus]: outlineRules,
        ['&:active']: { outline: 'none', opacity: theme.activeOpacity },
      }

  return Platform.OS === 'web' ? outlineFocusWeb : {}
}
