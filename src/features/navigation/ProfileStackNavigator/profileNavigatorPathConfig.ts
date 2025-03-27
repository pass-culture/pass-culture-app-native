import { LinkingOptions } from '@react-navigation/native'

import { profileRoutes } from 'features/navigation/ProfileStackNavigator/profileRoutes'
import {
  ProfileStack,
  ProfileStackParamList,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'

const { screensConfig } = getScreensAndConfig(profileRoutes, ProfileStack.Screen)

export const profileNavigatorPathConfig: LinkingOptions<ProfileStackParamList>['config'] = {
  initialRouteName: 'Accessibility',
  screens: screensConfig,
}
