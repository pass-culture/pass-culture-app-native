import { initialSearchState } from 'features/search/context/reducer'
import { hasUrlParams } from 'features/search/helpers/useSync/synchronizeStates'

const mockSearchState = initialSearchState

describe('hasUrlParams', () => {
  it('should be false when no pending params', () => {
    expect(hasUrlParams({}, mockSearchState)).toBe(false)
  })

  it('should be true when every key has null/undefined urlvalue or empty array', () => {
    expect(
      hasUrlParams(
        {
          lock: null,
          stock: undefined,
          two_smoking_barrels: [],
        },
        mockSearchState
      )
    ).toBe(true)
  })

  it('should be true when keys from pendingParams are equal to searchState keys', () => {
    expect(
      hasUrlParams(
        {
          lock: null,
          stock: undefined,
          two_smoking_barrels: [],
          priceRange: [10, 20],
          defaultMaxPrice: '30',
        },
        { ...mockSearchState, priceRange: [10, 20], defaultMaxPrice: '30' }
      )
    ).toBe(true)
  })

  it('should be false when keys from pendingParams are not all equal to searchState keys', () => {
    expect(
      hasUrlParams(
        {
          priceRange: [10, 20],
          defaultMaxPrice: '40',
        },
        { ...mockSearchState, priceRange: [10, 20], defaultMaxPrice: '30' }
      )
    ).toBe(false)
  })
})
