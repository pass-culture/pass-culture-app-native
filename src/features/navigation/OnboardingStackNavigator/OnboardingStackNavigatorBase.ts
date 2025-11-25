import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/types'

export const OnboardingStackNavigatorBase = createNativeStackNavigator<OnboardingStackParamList>()
