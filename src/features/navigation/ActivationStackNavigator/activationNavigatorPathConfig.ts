import { LinkingOptions } from '@react-navigation/native'

import { ActivationNavigatorBase } from 'features/navigation/ActivationStackNavigator/ActivationNavigatorBase'
import { activationRoutes } from 'features/navigation/ActivationStackNavigator/activationRoutes'
import { ActivationStackParamList } from 'features/navigation/ActivationStackNavigator/ActivationStackTypes'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'

const { screensConfig } = getScreensAndConfig(activationRoutes, ActivationNavigatorBase.Screen)

export const activationNavigatorPathConfig: LinkingOptions<ActivationStackParamList>['config'] = {
  initialRouteName: 'OnboardingWelcome',
  screens: screensConfig,
}
