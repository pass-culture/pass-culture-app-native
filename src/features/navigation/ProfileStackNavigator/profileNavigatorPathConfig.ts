import { LinkingOptions } from '@react-navigation/native'

import {
  ProfileStack,
  ProfileStackParamList,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { routes } from 'features/navigation/ProfileStackNavigator/routes'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'

const { screensConfig } = getScreensAndConfig(routes, ProfileStack.Screen)

export const profileNavigatorPathConfig: LinkingOptions<ProfileStackParamList>['config'] = {
  initialRouteName: 'Profile',
  screens: screensConfig,
}
