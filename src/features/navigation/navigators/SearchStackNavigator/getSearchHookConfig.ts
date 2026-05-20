import { SearchStackRouteName, SearchStackParamList } from './types'

export function getSearchHookConfig<Screen extends SearchStackRouteName>(
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
