import { DefaultTheme } from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export function customTouchableFocusOutline(
  theme: DefaultTheme,
  isFocus?: boolean,
  color?: ColorsEnum
) {
  return isFocus
    ? {
        outlineColor: color ?? theme.outline.color,
        outlineWidth: theme.outline.width.large,
        outlineStyle: theme.outline.style,
      }
    : {}
}

export function customFocusOutline(theme: DefaultTheme, color?: ColorsEnum) {
  return {
    ['&:focus']: {
      outlineColor: color ?? theme.outline.color,
      outlineWidth: theme.outline.width.normal,
      outlineStyle: theme.outline.style,
    },
    ['&:active']: {
      outline: 'none',
    },
  }
}
