import {
  OnboardingStackParamList,
  OnboardingStackRouteName,
} from 'features/navigation/navigators/OnboardingStackNavigator/types'

export function getOnboardingHookConfig<Screen extends OnboardingStackRouteName>(
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
