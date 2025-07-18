import {
  OnboardingStackParamList,
  OnboardingStackRouteName,
} from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'

export function getOnboardingPropConfig<Screen extends OnboardingStackRouteName>(
  screen: Screen,
  params?: OnboardingStackParamList[Screen]
): {
  screen: 'OnboardingStackNavigator'
  params?: {
    screen: Screen
    params?: OnboardingStackParamList[Screen]
  }
} {
  return {
    screen: 'OnboardingStackNavigator',
    params: { screen, params },
  }
}
