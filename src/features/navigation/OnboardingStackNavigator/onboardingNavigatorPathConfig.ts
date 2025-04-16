import { LinkingOptions } from '@react-navigation/native'

import { OnboardingNavigatorBase } from 'features/navigation/OnboardingStackNavigator/OnboardingNavigatorBase'
import { onboardingRoutes } from 'features/navigation/OnboardingStackNavigator/onboardingRoutes'
import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'

const { screensConfig } = getScreensAndConfig(onboardingRoutes, OnboardingNavigatorBase.Screen)

export const onboardingNavigatorPathConfig: LinkingOptions<OnboardingStackParamList>['config'] = {
  initialRouteName: 'OnboardingWelcome',
  screens: screensConfig,
}
