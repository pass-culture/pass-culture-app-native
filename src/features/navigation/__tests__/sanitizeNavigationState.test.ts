import { sanitizeNavigationState } from '../sanitizeNavigationState'

describe('sanitizeNavigationState', () => {
  const state = {
    index: 1,
    routes: [
      {
        name: 'TabNavigator',
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
    ],
  }

  const cleanedState = {
    index: 1,
    routes: [
      {
        name: 'TabNavigator',
        params: { screen: 'Search' },
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
            },
          ],
        },
      },
    ],
  }

  it('should clean search params from navigation state', () => {
    const newState = sanitizeNavigationState(state)
    expect(newState).toEqual(cleanedState)
  })

  it('should not mutate original navigation state', () => {
    const defaultStateCopy = JSON.parse(JSON.stringify(state))
    sanitizeNavigationState(state)
    expect(state).toEqual(defaultStateCopy)
  })
})
