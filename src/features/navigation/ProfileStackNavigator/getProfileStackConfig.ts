import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'

export function getProfileStackConfig<Screen extends ProfileStackRouteName>(
  screen: Screen,
  params?: ProfileStackParamList[Screen]
): [
  'TabNavigator',
  {
    screen: 'ProfileStackNavigator'
    params: { screen: Screen; params: ProfileStackParamList[Screen] }
  },
] {
  return ['TabNavigator', { screen: 'ProfileStackNavigator', params: { screen, params } }]
}
