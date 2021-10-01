import { renderHook } from '@testing-library/react-hooks'

import { navigate } from '__mocks__/@react-navigation/native'
import { getTabNavigateConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/pages/reducer'
import { useNavigateToSearchResults } from 'features/search/utils/useNavigateToSearchResults'
import { analytics } from 'libs/analytics'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

describe('useNavigateToSearchResults', () => {
  beforeEach(jest.clearAllMocks)
  it('should clear the previous search state', () => {
    const { result } = renderHook(() => useNavigateToSearchResults({ from: 'bookings' }))
    result.current()
    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT' })
  })

  it("should log the analytics event 'DiscoverOffers'", () => {
    const { result } = renderHook(() => useNavigateToSearchResults({ from: 'bookings' }))
    result.current()
    expect(analytics.logDiscoverOffers).toHaveBeenNthCalledWith(1, 'bookings')
  })

  it('should navigate to Search', () => {
    const { result } = renderHook(() => useNavigateToSearchResults({ from: 'bookings' }))
    result.current()
    const tabNavigateConfig = getTabNavigateConfig('Search', { showResults: true })
    expect(navigate).toHaveBeenNthCalledWith(1, tabNavigateConfig.screen, tabNavigateConfig.params)
  })
})
