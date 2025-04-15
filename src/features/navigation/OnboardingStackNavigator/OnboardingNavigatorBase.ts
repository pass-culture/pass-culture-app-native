import { createStackNavigator } from '@react-navigation/stack'

import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'

export const OnboardingNavigatorBase = createStackNavigator<OnboardingStackParamList>()
