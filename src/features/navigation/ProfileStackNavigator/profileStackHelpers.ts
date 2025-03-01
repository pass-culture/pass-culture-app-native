import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { profileStackRouteNames } from 'features/navigation/ProfileStackNavigator/routes'
import { ScreenNames } from 'features/navigation/RootNavigator/types'

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

export function isProfileStackScreen(screen: ScreenNames): screen is ProfileStackRouteName {
  // @ts-expect-error : ScreenNames is not necessarily a screen in ProfileStackRouteName
  return profileStackRouteNames.includes(screen)
}
