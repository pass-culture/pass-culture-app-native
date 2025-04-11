import { createStackNavigator } from '@react-navigation/stack'

import { OnboardingStackParamList as OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'

export const OnboardingNavigatorBase = createStackNavigator<OnboardingStackParamList>()
