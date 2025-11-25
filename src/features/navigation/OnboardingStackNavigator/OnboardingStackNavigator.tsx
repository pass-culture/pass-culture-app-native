import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { onboardingStackNavigatorPathConfig } from 'features/navigation/OnboardingStackNavigator/onboardingStackNavigatorPathConfig'

export const OnboardingStackNavigator = createNativeStackNavigator(
  onboardingStackNavigatorPathConfig
)

export const OnboardingScreen = createComponentForStaticNavigation(
  OnboardingStackNavigator,
  'Onboarding'
)
