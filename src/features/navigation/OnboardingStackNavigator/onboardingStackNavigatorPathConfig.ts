import { PathConfigMap } from '@react-navigation/native/lib/typescript/src'

import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/types'

export const onboardingStackNavigatorPathConfig: PathConfigMap<OnboardingStackParamList> = {
  OnboardingAgeSelectionFork: 'selection-age/generique',
  OnboardingAgeInformation: 'selection-age/information',
  OnboardingGeolocation: 'geolocalisation',
  OnboardingGeneralPublicWelcome: 'bienvenue-grand-public',
  OnboardingNotEligible: 'non-eligible',
  OnboardingWelcome: 'bienvenue',
}
