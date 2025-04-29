import { GenericRoute } from 'features/navigation/RootNavigator/types'

export type OnboardingStackParamList = {
  OnboardingAgeSelectionFork: undefined
  OnboardingAgeInformation: { age: 15 | 16 | 17 | 18 } | undefined
  OnboardingGeneralPublicWelcome: undefined
  OnboardingGeolocation: undefined
  OnboardingNotEligible: undefined
  OnboardingWelcome: undefined
}

export type OnboardingStackRouteName = keyof OnboardingStackParamList

export type OnboardingStackRoute = GenericRoute<OnboardingStackParamList>
