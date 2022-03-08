import { Platform } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export function customWebFocusOutline(theme: DefaultTheme, color?: ColorsEnum) {
  return Platform.OS === 'web'
    ? {
        ['&:focus']: {
          outlineColor: color ?? theme.outline.color,
          outlineWidth: theme.outline.width.normal,
          outlineStyle: theme.outline.style,
        },
        ['&:active']: {
          outline: 'none',
        },
      }
    : {}
}
