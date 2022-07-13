import { renderHook } from 'tests/utils'
import { theme } from 'theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

describe('customFocusOutline', () => {
  it('should return an empty object when is native', () => {
    const { result } = renderHook(() => customFocusOutline(theme))
    expect(result).toMatchObject({})
  })
})
