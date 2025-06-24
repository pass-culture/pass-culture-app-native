import { renderHook } from 'tests/utils/web'
import { theme } from 'theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

const underlineColor = theme.designSystem.color.text.default
let isHover = true

describe('getHoverStyle', () => {
  it('should return the inline style if isHover = undefined', () => {
    const { result } = renderHook(() => getHoverStyle({ underlineColor }))

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

  it('should return the textColor', () => {
    const { result } = renderHook(() =>
      getHoverStyle({ textColor: theme.designSystem.color.text.default, isHover })
    )

    expect(result.current).toEqual({
      color: theme.designSystem.color.text.default,
    })
  })

  it('should return the underlineColor', () => {
    const { result } = renderHook(() => getHoverStyle({ underlineColor, isHover }))

    expect(result.current).toEqual({
      textDecoration: 'underline',
      textDecorationColor: underlineColor,
    })
  })

  it('should return the borderColor', () => {
    const { result } = renderHook(() =>
      getHoverStyle({ borderColor: theme.designSystem.color.border.default, isHover })
    )

    expect(result.current).toEqual({
      borderColor: theme.designSystem.color.border.default,
    })
  })

  it('should return the backgroundColor', () => {
    const { result } = renderHook(() =>
      getHoverStyle({ backgroundColor: theme.designSystem.color.background.default, isHover })
    )

    expect(result.current).toEqual({
      backgroundColor: theme.designSystem.color.background.default,
    })
  })

  it('should return an empty object if isHover = false', () => {
    isHover = false
    const { result } = renderHook(() => getHoverStyle({ underlineColor, isHover }))

    expect(result.current).toEqual({})
  })
})
