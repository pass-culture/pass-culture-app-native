import { getIsPreviousRouteFromSearch } from 'features/search/helpers/getIsPreviousRouteFromSearch/getIsPreviousRouteFromSearch'

describe('getIsPreviousRouteFromSearch', () => {
  it('should return true when previous route is venue and current route TabNavigator and screen is Search', () => {
    const routes = [
      {
        key: 'Venue',
        name: 'Venue',
      },
      { key: 'TabNavigator', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
    ]
    const isSearchPreviousRoute = getIsPreviousRouteFromSearch('Venue', routes)

    expect(isSearchPreviousRoute).toBeTruthy()
  })

  it('should return true when the navigation contains a specified route in the SearchStackNavigator', () => {
    const routes = [
      {
        key: 'TabNavigator',
        name: 'TabNavigator',
        params: { screen: 'SearchStackNavigator' },
        state: {
          routes: [{ name: 'SearchStackNavigator', state: { routes: [{ name: 'SearchN1' }] } }],
        },
      },
    ]
    const isSearchPreviousRoute = getIsPreviousRouteFromSearch('SearchN1', routes)

    expect(isSearchPreviousRoute).toBeTruthy()
  })

  it('should return false when previous route is not Venue', () => {
    const routes = [
      { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
    ]
    const isSearchPreviousRoute = getIsPreviousRouteFromSearch('Venue', routes)

    expect(isSearchPreviousRoute).toBeFalsy()
  })

  it('should return false when previous route is Venue and current route is TabNavigator and screen is not Search', () => {
    const routes = [
      { key: 'Venue', name: 'Venue' },
      {
        key: 'TabNavigator',
        name: 'TabNavigator',
        params: { screen: 'NotSearchStackNavigator' },
      },
    ]
    const isSearchPreviousRoute = getIsPreviousRouteFromSearch('Venue', routes)

    expect(isSearchPreviousRoute).toBeFalsy()
  })

  it('should return false when previous route is TabNavigator and screen is not Search', () => {
    const routes = [
      { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'Bookings' } },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
    ]
    const isSearchPreviousRoute = getIsPreviousRouteFromSearch('Venue', routes)

    expect(isSearchPreviousRoute).toBeFalsy()
  })
})
