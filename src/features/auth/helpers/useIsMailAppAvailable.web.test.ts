import { renderHook } from 'tests/utils/web'

import { useIsMailAppAvailable } from './useIsMailAppAvailable'

describe('useIsMailAppAvailable', () => {
  it('should be false', () => {
    const { result } = renderUseIsMailAppAvailable()

    expect(result.current).toBe(false)
  })
})

const renderUseIsMailAppAvailable = () => {
  return renderHook(useIsMailAppAvailable)
}
