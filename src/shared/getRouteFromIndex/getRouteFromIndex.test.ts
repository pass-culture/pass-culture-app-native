import { ParamListBase, RouteProp } from '@react-navigation/core'

import { getRouteFromIndex } from 'shared/getRouteFromIndex/getRouteFromIndex'

describe('getRouteFromIndex', () => {
  it('should return undefined when there is not route', () => {
    const routes: RouteProp<ParamListBase>[] = []
    const previousRoute = getRouteFromIndex(routes, 1)

    expect(previousRoute).toBeFalsy()
  })

  it('should return undefined when index not consistent', () => {
    const routes = [
      { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'Bookings' } },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'Search' } },
    ]
    const previousRoute = getRouteFromIndex(routes, 10)

    expect(previousRoute).toEqual(undefined)
  })

  it('should return previous route when there are several routes and index > 1', () => {
    const routes = [
      { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'Bookings' } },
      { key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'Search' } },
    ]
    const previousRoute = getRouteFromIndex(routes, 2)

    expect(previousRoute).toEqual({
      key: 'TabNavigator1',
      name: 'TabNavigator',
      params: { screen: 'Bookings' },
    })
  })

  it('should return current route when there is only one route and index = 1', () => {
    const routes = [{ key: 'TabNavigator2', name: 'TabNavigator', params: { screen: 'Search' } }]
    const previousRoute = getRouteFromIndex(routes, 1)

    expect(previousRoute).toEqual({
      key: 'TabNavigator2',
      name: 'TabNavigator',
      params: { screen: 'Search' },
    })
  })
})
