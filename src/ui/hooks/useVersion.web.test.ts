import { renderHook } from 'tests/utils/web'

import { useVersion } from './useVersion'

describe('useVersion', () => {
  it('should return only the version on web', () => {
    const { result } = renderHook(() => useVersion())
    expect(result.current).toEqual('Version\u00A01.10.5')
  })
})
