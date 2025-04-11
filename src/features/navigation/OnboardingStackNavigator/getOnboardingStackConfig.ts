import {
  OnboardingStackParamList,
  OnboardingStackRouteName,
} from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'

export function getOnboardingStackConfig<Screen extends OnboardingStackRouteName>(
  screen: Screen,
  params?: OnboardingStackParamList[Screen]
): [
  'OnboardingStackNavigator',
  {
    screen: Screen
    params: OnboardingStackParamList[Screen]
  },
] {
  return ['OnboardingStackNavigator', { screen, params }]
}
