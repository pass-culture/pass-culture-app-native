import { renderHook } from '@testing-library/react-hooks'

import { theme } from 'theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

describe('getHoverStyle', () => {
  it('should return an empty object when is native', () => {
    const { result } = renderHook(() => getHoverStyle(theme.colors.black))
    expect(result).toMatchObject({})
  })
})
