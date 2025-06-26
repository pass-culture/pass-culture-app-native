import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStackTypes'

export function getProfileNavConfig<Screen extends ProfileStackRouteName>(
  screen: Screen,
  params?: ProfileStackParamList[Screen]
): {
  screen: 'ProfileStackNavigator'
  params?: {
    screen: Screen
    params?: ProfileStackParamList[Screen]
  }
} {
  return {
    screen: 'ProfileStackNavigator',
    params: { screen, params },
  }
}
