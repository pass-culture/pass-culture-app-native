import { getIsSearchPreviousRoute } from 'features/search/helpers/getIsSearchPreviousRoute/getIsSearchPreviousRoute'
import { SearchView } from 'features/search/types'

describe('getIsSearchPreviousRoute', () => {
  it('should return false when previous route is TabNavigator and screen is not Search', () => {
    const routes = [
      { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'Bookings' } },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'Search' } },
    ]
    const isSearchPreviousRoute = getIsSearchPreviousRoute(routes)

    expect(isSearchPreviousRoute).toBeFalsy()
  })

  it('should return false when previous route is not TabNavigator', () => {
    const routes = [
      { key: 'Venue1', name: 'Venue' },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'Search' } },
    ]
    const isSearchPreviousRoute = getIsSearchPreviousRoute(routes)

    expect(isSearchPreviousRoute).toBeFalsy()
  })

  it('should return false when previous route is TabNavigator and screen is Search and current and previous views are identical and there are not Results', () => {
    const routes = [
      {
        key: 'TabNavigator1',
        name: 'TabNavigator',
        params: { screen: 'Search', params: { view: SearchView.Landing } },
      },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'Bookings' } },
    ]
    const isSearchPreviousRoute = getIsSearchPreviousRoute(routes, SearchView.Landing)

    expect(isSearchPreviousRoute).toBeFalsy()
  })

  it('should return false when previous route is Venue and current route is Search with current and previous views at Results', () => {
    const routes = [
      { key: 'Venue1', name: 'Venue' },
      {
        key: 'TabNavigator1',
        name: 'TabNavigator',
        params: { screen: 'Search', params: { view: SearchView.Results } },
      },
    ]
    const isSearchPreviousRoute = getIsSearchPreviousRoute(routes, SearchView.Results)

    expect(isSearchPreviousRoute).toBeFalsy()
  })

  it('should return true when previous route is TabNavigator and screen is Search and current and previous views are Results and previous route is not Venue', () => {
    const routes = [
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'Bookings' } },
      {
        key: 'TabNavigator1',
        name: 'TabNavigator',
        params: { screen: 'Search', params: { previousView: SearchView.Results } },
      },
    ]
    const isSearchPreviousRoute = getIsSearchPreviousRoute(routes, SearchView.Results)

    expect(isSearchPreviousRoute).toBeTruthy()
  })
})
