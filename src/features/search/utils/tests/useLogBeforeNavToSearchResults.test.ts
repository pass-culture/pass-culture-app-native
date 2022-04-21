import { renderHook } from '@testing-library/react-hooks'

import { initialSearchState } from 'features/search/pages/reducer'
import { useLogBeforeNavToSearchResults } from 'features/search/utils/useLogBeforeNavToSearchResults'
import { analytics } from 'libs/analytics'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

describe('useLogBeforeNavToSearchResults', () => {
  it('should clear the previous search state', () => {
    const { result } = renderHook(() => useLogBeforeNavToSearchResults({ from: 'bookings' }))
    result.current()
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT' })
  })

  it("should log the analytics event 'DiscoverOffers'", () => {
    const { result } = renderHook(() => useLogBeforeNavToSearchResults({ from: 'bookings' }))
    result.current()
    expect(analytics.logDiscoverOffers).toHaveBeenNthCalledWith(1, 'bookings')
  })
})
