import { getIsVenuePreviousRoute } from 'features/search/helpers/getIsVenuePreviousRoute/getIsVenuePreviousRoute'

describe('getIsVenuePreviousRoute', () => {
  it('should return true when previous route is venue and current route TabNavigator and screen is Search', () => {
    const routes = [
      {
        key: 'Venue',
        name: 'Venue',
      },
      { key: 'TabNavigator', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
    ]
    const isSearchPreviousRoute = getIsVenuePreviousRoute(routes)

    expect(isSearchPreviousRoute).toBeTruthy()
  })

  it('should return false when previous route is not Venue', () => {
    const routes = [
      { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
    ]
    const isSearchPreviousRoute = getIsVenuePreviousRoute(routes)

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
    const isSearchPreviousRoute = getIsVenuePreviousRoute(routes)

    expect(isSearchPreviousRoute).toBeFalsy()
  })

  it('should return false when previous route is TabNavigator and screen is not Search', () => {
    const routes = [
      { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'Bookings' } },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'SearchStackNavigator' } },
    ]
    const isSearchPreviousRoute = getIsVenuePreviousRoute(routes)

    expect(isSearchPreviousRoute).toBeFalsy()
  })
})
