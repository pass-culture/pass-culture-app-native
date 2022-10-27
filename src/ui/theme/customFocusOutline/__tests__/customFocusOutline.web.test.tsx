import { theme } from 'theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

const color = theme.colors.white

describe('customWebFocusOutline', () => {
  it('should display the custom outline if isFocus = true', () => {
    const result = customFocusOutline({ theme, isFocus: true })
    expect(result).toEqual({
      outlineColor: theme.outline.color,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should change the custom outline color if useFocus = true and use custom color', () => {
    const result = customFocusOutline({ theme, color, isFocus: true })
    expect(result).toEqual({
      outlineColor: theme.colors.white,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should display the custom outline when isFocus = false', () => {
    const result = customFocusOutline({ theme, isFocus: false })
    expect(result).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus-visible': {
        outlineColor: theme.outline.color,
        outlineStyle: theme.outline.style,
        outlineWidth: theme.outline.width,
        outlineOffset: theme.outline.offSet,
      },
    })
  })

  it('should change the custom outline color if when isFocus = false and use custom color', () => {
    const result = customFocusOutline({ theme, color, isFocus: false })
    expect(result).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus-visible': {
        outlineColor: theme.colors.white,
        outlineStyle: theme.outline.style,
        outlineWidth: theme.outline.width,
        outlineOffset: theme.outline.offSet,
      },
    })
  })
})
