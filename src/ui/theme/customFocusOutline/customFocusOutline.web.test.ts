import { DefaultTheme } from 'styled-components/native'

import { theme } from 'theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

const currentTheme = theme as DefaultTheme
const color = currentTheme.designSystem.color.outline.inverted

describe('customWebFocusOutline', () => {
  it('should display the custom outline if isFocus = true', () => {
    const result = customFocusOutline({ theme: currentTheme, isFocus: true })

    expect(result).toEqual({
      outlineColor: theme.designSystem.color.outline.default,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should change the custom outline color if useFocus = true and uses custom color', () => {
    const result = customFocusOutline({ theme: currentTheme, color, isFocus: true })

    expect(result).toEqual({
      outlineColor: theme.designSystem.color.outline.inverted,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should change the custom outline width if useFocus = true and uses custom width', () => {
    const result = customFocusOutline({ theme: currentTheme, width: 1, isFocus: true })

    expect(result).toEqual({
      outlineColor: theme.designSystem.color.outline.default,
      outlineStyle: theme.outline.style,
      outlineWidth: 1,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should display the custom outline when isFocus = false', () => {
    const result = customFocusOutline({ theme: currentTheme, isFocus: false })

    expect(result).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus-visible': {
        outlineColor: theme.designSystem.color.outline.default,
        outlineStyle: theme.outline.style,
        outlineWidth: theme.outline.width,
        outlineOffset: theme.outline.offSet,
      },
    })
  })

  it('should change the custom outline color when isFocus = false and uses custom color', () => {
    const result = customFocusOutline({ theme: currentTheme, color, isFocus: false })

    expect(result).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus-visible': {
        outlineColor: theme.designSystem.color.outline.inverted,
        outlineStyle: theme.outline.style,
        outlineWidth: theme.outline.width,
        outlineOffset: theme.outline.offSet,
      },
    })
  })

  it('should change the custom outline width when isFocus = false and uses custom width', () => {
    const result = customFocusOutline({ theme: currentTheme, width: 1, isFocus: false })

    expect(result).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus-visible': {
        outlineColor: theme.designSystem.color.outline.default,
        outlineStyle: theme.outline.style,
        outlineWidth: 1,
        outlineOffset: theme.outline.offSet,
      },
    })
  })
})
