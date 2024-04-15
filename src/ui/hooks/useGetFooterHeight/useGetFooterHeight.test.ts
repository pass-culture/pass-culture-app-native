import { renderHook } from 'tests/utils'
import { useGetFooterHeight } from 'ui/hooks/useGetFooterHeight/useGetFooterHeight'

describe('useGetFooterHeight', () => {
  it('should return correct footer height', () => {
    const footerHeight = 40
    const { result } = renderHook(() => useGetFooterHeight(footerHeight))

    expect(result.current).toEqual(49)
  })
})
