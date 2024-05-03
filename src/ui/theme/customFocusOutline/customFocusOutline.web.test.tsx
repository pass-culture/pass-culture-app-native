import { theme } from 'theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

jest.unmock('ui/theme/customFocusOutline/customFocusOutline')

const color = theme.colors.white

describe('customWebFocusOutline', () => {
  it('should display the custom outline if isFocus = true', () => {
    const result = customFocusOutline({ isFocus: true })

    expect(result).toEqual({
      outlineColor: theme.outline.color,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should change the custom outline color if useFocus = true and uses custom color', () => {
    const result = customFocusOutline({ color, isFocus: true })

    expect(result).toEqual({
      outlineColor: theme.colors.white,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should change the custom outline width if useFocus = true and uses custom width', () => {
    const result = customFocusOutline({ width: 1, isFocus: true })

    expect(result).toEqual({
      outlineColor: theme.outline.color,
      outlineStyle: theme.outline.style,
      outlineWidth: 1,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should display the custom outline when isFocus = false', () => {
    const result = customFocusOutline({ isFocus: false })

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

  it('should change the custom outline color when isFocus = false and uses custom color', () => {
    const result = customFocusOutline({ color, isFocus: false })

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

  it('should change the custom outline width when isFocus = false and uses custom width', () => {
    const result = customFocusOutline({ width: 1, isFocus: false })

    expect(result).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus-visible': {
        outlineColor: theme.outline.color,
        outlineStyle: theme.outline.style,
        outlineWidth: 1,
        outlineOffset: theme.outline.offSet,
      },
    })
  })
})
