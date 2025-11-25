import { SearchStackRouteName, SearchStackParamList } from './types'

export function getSearchPropConfig<Screen extends SearchStackRouteName>(
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
