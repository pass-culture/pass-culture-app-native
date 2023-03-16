import { renderHook } from 'tests/utils'

import { useCodePushVersion } from './useCodePushVersion'

describe('useCodePushVersion', () => {
  it('should return null', () => {
    const { result } = renderHook(() => useCodePushVersion())
    expect(result.current).toBeNull()
  })
})
