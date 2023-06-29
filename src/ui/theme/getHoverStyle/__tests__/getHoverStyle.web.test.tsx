import { renderHook } from 'tests/utils/web'
import { theme } from 'theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

const underlineColor = theme.colors.black
let isHover = true

describe('getHoverStyle', () => {
  it('should return an empty object if underlineColor = null', () => {
    const { result } = renderHook(() => getHoverStyle(null))
    expect(result).toMatchObject({})
  })

  it('should return the inline style if isHover = undefined', () => {
    const { result } = renderHook(() => getHoverStyle(underlineColor))
    expect(result.current).toEqual({
      ['&:hover']: {
        textDecoration: 'underline',
        textDecorationColor: underlineColor,
        ['&:disabled']: {
          textDecoration: 'none',
        },
      },
    })
  })

  it('should return the custom style if isHover = true', () => {
    const { result } = renderHook(() => getHoverStyle(underlineColor, isHover))
    expect(result.current).toEqual({
      textDecoration: 'underline',
      textDecorationColor: underlineColor,
      ['&:disabled']: {
        textDecoration: 'none',
      },
    })
  })

  it('should return an empty object if isHover = false', () => {
    isHover = false
    const { result } = renderHook(() => getHoverStyle(underlineColor, isHover))
    expect(result.current).toEqual({})
  })
})
