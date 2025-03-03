import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { profileStackRouteNames } from 'features/navigation/ProfileStackNavigator/routes'

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

export function isProfileStackScreen(screen: string): screen is ProfileStackRouteName {
  return profileStackRouteNames.includes(screen)
}
