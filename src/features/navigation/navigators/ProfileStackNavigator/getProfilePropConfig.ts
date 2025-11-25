import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/navigators/ProfileStackNavigator/types'

export function getProfilePropConfig<Screen extends ProfileStackRouteName>(
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
