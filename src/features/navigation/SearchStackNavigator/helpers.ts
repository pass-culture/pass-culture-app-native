import { SearchStackRouteName, SearchStackParamList } from './types'

export function getSearchStackConfig<Screen extends SearchStackRouteName>(
  screen: Screen,
  params?: SearchStackParamList[Screen]
): [
  'TabNavigator',
  {
    screen: 'SearchStackNavigator'
    params: { screen: Screen; params: SearchStackParamList[Screen] }
  },
] {
  return ['TabNavigator', { screen: 'SearchStackNavigator', params: { screen, params } }]
}

export function getNavigateToConfig<Screen extends SearchStackRouteName>(
  screen: Screen,
  params?: SearchStackParamList[Screen]
): {
  screen: 'TabNavigator'
  params: {
    screen: 'SearchStackNavigator'
    params: { screen: Screen; params: SearchStackParamList[Screen] }
  }
} {
  return {
    screen: 'TabNavigator',
    params: { screen: 'SearchStackNavigator', params: { screen, params } },
  }
}
