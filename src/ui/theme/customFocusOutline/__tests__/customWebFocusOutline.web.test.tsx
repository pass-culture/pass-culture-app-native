import { renderHook } from '@testing-library/react-hooks'

import { theme } from 'theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customWebFocusOutline } from 'ui/theme/customFocusOutline/customWebFocusOutline'

const color = ColorsEnum.WHITE

describe('customWebFocusOutline', () => {
  it('should display the custom outline if is focus', () => {
    const { result } = renderHook(() => customWebFocusOutline(theme))
    expect(result.current['&:focus'].outlineColor).toEqual(theme.outline.color)
    expect(result.current['&:focus'].outlineStyle).toEqual(theme.outline.style)
    expect(result.current['&:focus'].outlineWidth).toEqual(theme.outline.width.normal)
    expect(result.current['&:active'].outline).toEqual('none')
  })

  it('should change the custom outline color if use custom color', () => {
    const { result } = renderHook(() => customWebFocusOutline(theme, color))
    expect(result.current['&:focus'].outlineColor).toEqual(theme.colors.white)
  })
})
