import { Platform } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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
        ['&:focus']: outlineRules,
        ['&:active']: { outline: 'none' },
      }

  return Platform.OS === 'web' ? outlineFocusWeb : {}
}
