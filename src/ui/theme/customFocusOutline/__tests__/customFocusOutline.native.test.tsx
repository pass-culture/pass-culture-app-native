import { renderHook } from '@testing-library/react-hooks'

import { theme } from 'theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

describe('customFocusOutline', () => {
  it('should return an empty object when is native', () => {
    const { result } = renderHook(() => customFocusOutline(theme))
    expect(result).toMatchObject({})
  })
})
