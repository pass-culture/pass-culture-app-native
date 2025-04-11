import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { TutorialType } from 'features/tutorial/types'

export type OnboardingStackParamList = {
  AgeSelectionFork: TutorialType | undefined
  OnboardingAgeInformation: { age: 15 | 16 | 17 | 18 } | undefined
  OnboardingGeneralPublicWelcome: undefined
  OnboardingGeolocation: undefined
  OnboardingNotEligible: undefined
  OnboardingWelcome: TutorialType | undefined
  ProfileTutorialAgeInformationCredit: undefined
}

export type OnboardingStackRouteName = keyof OnboardingStackParamList

export type OnboardingStackRoute = GenericRoute<OnboardingStackParamList>
