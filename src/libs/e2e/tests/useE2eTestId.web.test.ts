import { renderHook } from 'tests/utils'

import { useE2eTestId } from '../useE2eTestId.web'

const mockUseIsE2e = jest.fn()

jest.mock('libs/e2e/E2eContextProvider', () => ({
  useIsE2e: () => mockUseIsE2e(),
}))

describe('useE2eTestId', () => {
  it('should set accessibilityLabel and testID when useIsE2e return true', () => {
    mockUseIsE2e.mockImplementationOnce(() => true)
    const testID = 'Bonjour Monde !'
    const { result } = renderHook(() => useE2eTestId(testID))

    expect(result.current.accessibilityLabel).toBe(testID)
    expect(result.current.testID).toBe(testID)
    expect(result.current['data-testid']).toBe(testID)
  })
  it('should set testID without accessibilityLabel when useIsE2e return false', () => {
    mockUseIsE2e.mockImplementationOnce(() => false)
    const testID = 'Bonjour Monde !'
    const { result } = renderHook(() => useE2eTestId(testID))

    expect(result.current.accessibilityLabel).toBeUndefined()
    expect(result.current.testID).toBe(testID)
    expect(result.current['data-testid']).toBe(testID)
  })
})
