import { renderHook } from '@testing-library/react-hooks'

import { theme } from 'theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

const color = ColorsEnum.WHITE
let isFocus = true

describe('customWebFocusOutline', () => {
  it('should display the custom outline if isFocus = true', () => {
    const { result } = renderHook(() => customFocusOutline(theme, undefined, isFocus))
    expect(result.current).toEqual({
      outlineColor: theme.outline.color,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should change the custom outline color if useFocus = true and use custom color', () => {
    const { result } = renderHook(() => customFocusOutline(theme, color, isFocus))
    expect(result.current).toEqual({
      outlineColor: theme.colors.white,
      outlineStyle: theme.outline.style,
      outlineWidth: theme.outline.width,
      outlineOffset: theme.outline.offSet,
    })
  })

  it('should display the custom outline when isFocus = false', () => {
    isFocus = false
    const { result } = renderHook(() => customFocusOutline(theme))
    expect(result.current).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus': {
        outlineColor: theme.outline.color,
        outlineStyle: theme.outline.style,
        outlineWidth: theme.outline.width,
        outlineOffset: theme.outline.offSet,
      },
    })
  })

  it('should change the custom outline color if when isFocus = false and use custom color', () => {
    isFocus = false
    const { result } = renderHook(() => customFocusOutline(theme, color))
    expect(result.current).toEqual({
      '&:active': { outline: 'none', opacity: theme.activeOpacity },
      '&:focus': {
        outlineColor: theme.colors.white,
        outlineStyle: theme.outline.style,
        outlineWidth: theme.outline.width,
        outlineOffset: theme.outline.offSet,
      },
    })
  })
})
