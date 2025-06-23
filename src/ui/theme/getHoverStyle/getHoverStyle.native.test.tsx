import { renderHook } from 'tests/utils'
import { theme } from 'theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

describe('getHoverStyle', () => {
  it('should return an empty object when is native', () => {
    const { result } = renderHook(() => getHoverStyle(theme.designSystem.color.text.default))

    expect(result).toMatchObject({})
  })
})
