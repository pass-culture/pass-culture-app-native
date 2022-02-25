import { DefaultTheme } from 'styled-components/native'

export function customFocusOutline(theme: DefaultTheme, isFocus?: boolean) {
  return isFocus
    ? {
        outlineColor: theme.outline.color,
        outlineWidth: theme.outline.width,
        outlineStyle: theme.outline.style,
      }
    : {}
}
