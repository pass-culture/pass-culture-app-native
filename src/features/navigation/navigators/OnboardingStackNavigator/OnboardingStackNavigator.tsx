import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { OnboardingAgeInformation } from 'features/onboarding/pages/onboarding/OnboardingAgeInformation'
import { OnboardingAgeSelectionFork } from 'features/onboarding/pages/onboarding/OnboardingAgeSelectionFork'
import { OnboardingGeneralPublicWelcome } from 'features/onboarding/pages/onboarding/OnboardingGeneralPublicWelcome'
import { OnboardingGeolocation } from 'features/onboarding/pages/onboarding/OnboardingGeolocation'
import { OnboardingNotEligible } from 'features/onboarding/pages/onboarding/OnboardingNotEligible'
import { OnboardingWelcome } from 'features/onboarding/pages/onboarding/OnboardingWelcome'

const onboardingStackNavigatorPathDefinition = {
  initialRouteName: 'OnboardingWelcome',
  screens: {
    OnboardingWelcome: {
      screen: OnboardingWelcome,
      linking: {
        path: 'bienvenue',
      },
      options: { title: 'Bienvenue' },
    },
    OnboardingGeneralPublicWelcome: {
      screen: OnboardingGeneralPublicWelcome,
      linking: {
        path: 'bienvenue-grand-public',
      },
      options: { title: 'Bienvenue' },
    },
    OnboardingAgeSelectionFork: {
      screen: OnboardingAgeSelectionFork,
      linking: {
        path: 'selection-age/generique',
      },
      options: { title: 'Sélection d’âge' },
    },
    OnboardingAgeInformation: {
      screen: OnboardingAgeInformation,
      linking: {
        path: 'selection-age/information',
      },
      options: { title: 'Information d’âge' },
    },
    OnboardingGeolocation: {
      screen: OnboardingGeolocation,
      linking: {
        path: 'geolocalisation',
      },
      options: { title: 'Active ta géolocalisation' },
    },
    OnboardingNotEligible: {
      screen: OnboardingNotEligible,
      linking: {
        path: 'non-eligible',
      },
      options: { title: 'Encore un peu de patience' },
    },
  },
}

export const OnboardingStackNavigator = createNativeStackNavigator(
  onboardingStackNavigatorPathDefinition
)

const OnboardingScreen = createComponentForStaticNavigation(OnboardingStackNavigator, 'Onboarding')

export default OnboardingScreen
