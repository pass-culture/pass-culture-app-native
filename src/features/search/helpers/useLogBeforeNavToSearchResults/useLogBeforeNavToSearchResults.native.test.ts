import { initialSearchState } from 'features/search/context/reducer'
import { useLogBeforeNavToSearchResults } from 'features/search/helpers/useLogBeforeNavToSearchResults/useLogBeforeNavToSearchResults'
import { analytics } from 'libs/analytics/provider'
import { renderHook } from 'tests/utils'

const mockSearchState = initialSearchState
const mockResetSearch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, resetSearch: mockResetSearch }),
}))

describe('useLogBeforeNavToSearchResults', () => {
  it('should clear the previous search state', () => {
    const { result } = renderHook(() => useLogBeforeNavToSearchResults({ from: 'bookings' }))
    result.current()

    expect(mockResetSearch).toHaveBeenCalledTimes(1)
  })

  it("should log the analytics event 'DiscoverOffers'", () => {
    const { result } = renderHook(() => useLogBeforeNavToSearchResults({ from: 'bookings' }))
    result.current()

    expect(analytics.logDiscoverOffers).toHaveBeenNthCalledWith(1, 'bookings')
  })
})
