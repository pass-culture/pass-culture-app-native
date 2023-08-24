import { NavigationState } from '@react-navigation/native'

import { SearchView } from 'features/search/types'

import { sanitizeNavigationState } from './sanitizeNavigationState'

describe('sanitizeNavigationState', () => {
  const state: NavigationState = {
    index: 1,
    key: 'stack-JIratXd-2D1Ia1ebVgL-C',
    stale: false,
    type: 'stack',
    routeNames: ['TabNavigator'],
    routes: [
      {
        name: 'TabNavigator',
        key: 'stack-rdubnndFgaqXyYK6noV_e',
        params: { screen: 'Search', params: { locationFilter: { locationType: 'EVERYWHERE' } } },
        state: {
          routeNames: ['Home', 'Search'],
          history: [
            { type: 'route', key: 'Home-XHWcHfi6Qpstz4JqwXxK_' },
            { type: 'route', key: 'Search-xufH8CYsq0efty7Gl1gA2' },
          ],
          routes: [
            { name: 'Home', key: 'Home-XHWcHfi6Qpstz4JqwXxK_' },
            {
              name: 'Search',
              key: 'Search-xufH8CYsq0efty7Gl1gA2',
              params: { locationFilter: { locationType: 'EVERYWHERE' } },
            },
          ],
        },
      },
      {
        name: 'TabNavigator',
        key: 'stack-rdubnndFgaqXyYK6noV_e',
        params: {
          screen: 'Search',
          params: { locationFilter: { locationType: 'EVERYWHERE' }, view: SearchView.Results },
        },
        state: {
          routeNames: ['Home', 'Search'],
          history: [
            { type: 'route', key: 'Home-XHWcHfi6Qpstz4JqwXxK_' },
            { type: 'route', key: 'Search-xufH8CYsq0efty7Gl1gA2' },
          ],
          routes: [
            { name: 'Home', key: 'Home-XHWcHfi6Qpstz4JqwXxK_' },
            {
              name: 'Search',
              key: 'Search-xufH8CYsq0efty7Gl1gA2',
              params: { locationFilter: { locationType: 'EVERYWHERE' } },
            },
          ],
        },
      },
    ],
  }

  it('should not mutate original navigation state', () => {
    const defaultStateCopy = JSON.parse(JSON.stringify(state))
    sanitizeNavigationState(state)
    expect(state).toEqual(defaultStateCopy)
  })

  it('should save 1 entry in history with index 0', () => {
    const newState = sanitizeNavigationState(state)
    expect(newState.index).toEqual(0)
    expect((newState.routes as []).length).toEqual(1)
  })
})
