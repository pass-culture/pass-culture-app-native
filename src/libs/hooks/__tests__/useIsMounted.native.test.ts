import useIsMounted from 'libs/hooks/useIsMounted'
import { renderHook } from 'tests/utils'

describe('useIsMounted()', () => {
  it('should return true if mounted and false if not', () => {
    const { result, unmount } = renderHook(useIsMounted)
    expect(result.current.current).toBe(true)
    unmount()
    expect(result.current.current).toBeFalsy()
  })
})
