import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/navigators/ProfileStackNavigator/types'

export function getProfileHookConfig<Screen extends ProfileStackRouteName>(
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
