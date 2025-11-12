import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'

export const OnboardingStackNavigatorBase = createNativeStackNavigator<OnboardingStackParamList>()
