import { renderHook } from '@testing-library/react-hooks'

import { theme } from 'theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline'

let isFocus = true

describe('customFocusOutline', () => {
  it('should display the custom outline if is focus', () => {
    const { result } = renderHook(() => customFocusOutline(theme, isFocus))
    expect(result.current.outlineColor).toEqual(theme.outline.color)
    expect(result.current.outlineStyle).toEqual(theme.outline.style)
    expect(result.current.outlineWidth).toEqual(theme.outline.width)
  })

  it('should not display the custom outline if is not focus', () => {
    isFocus = false
    const { result } = renderHook(() => customFocusOutline(theme, isFocus))
    expect(result.current.outlineColor).toEqual(undefined)
    expect(result.current.outlineStyle).toEqual(undefined)
    expect(result.current.outlineWidth).toEqual(undefined)
  })
})
