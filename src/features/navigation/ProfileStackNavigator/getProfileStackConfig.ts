import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStackTypes'

export function getProfileStackConfig<Screen extends ProfileStackRouteName>(
  screen: Screen,
  params?: ProfileStackParamList[Screen]
): [
  'ProfileStackNavigator',
  {
    screen: Screen
    params: ProfileStackParamList[Screen]
  },
] {
  return ['ProfileStackNavigator', { screen, params }]
}
