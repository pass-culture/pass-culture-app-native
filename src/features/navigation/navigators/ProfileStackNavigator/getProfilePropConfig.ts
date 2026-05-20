import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/navigators/ProfileStackNavigator/types'

export const getProfilePropConfig = <Screen extends ProfileStackRouteName>(
  screen: Screen,
  params?: ProfileStackParamList[Screen]
): {
  screen: 'ProfileStackNavigator'
  params?: {
    screen: Screen
    params?: ProfileStackParamList[Screen]
  }
} => ({
  screen: 'ProfileStackNavigator',
  params: { screen, params },
})
