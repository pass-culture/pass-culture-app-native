import { renderHook } from '@testing-library/react-hooks'

import { theme } from 'theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customTouchableFocusOutline } from 'ui/theme/customFocusOutline/customTouchableFocusOutline'

let isFocus = true
const color = ColorsEnum.WHITE

describe('customFocusOutline', () => {
  describe('customTouchableFocusOutline()', () => {
    it('should display the custom outline if is focus', () => {
      const { result } = renderHook(() => customTouchableFocusOutline(theme, isFocus))
      expect(result.current.outlineColor).toEqual(theme.outline.color)
      expect(result.current.outlineStyle).toEqual(theme.outline.style)
      expect(result.current.outlineWidth).toEqual(theme.outline.width.large)
    })

    it('should change the custom outline color if use custom color', () => {
      const { result } = renderHook(() => customTouchableFocusOutline(theme, isFocus, color))
      expect(result.current.outlineColor).toEqual(theme.colors.white)
    })

    it('should not display the custom outline if is not focus', () => {
      isFocus = false
      const { result } = renderHook(() => customTouchableFocusOutline(theme, isFocus))
      expect(result.current.outlineColor).toEqual(undefined)
      expect(result.current.outlineStyle).toEqual(undefined)
      expect(result.current.outlineWidth).toEqual(undefined)
    })
  })
})
