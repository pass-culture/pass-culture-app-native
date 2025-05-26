import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import { OnboardingStackRoute } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'

export const onboardingRoutes: OnboardingStackRoute[] = [
  {
    name: 'OnboardingAgeSelectionFork',
    component: ComponentForPathConfig,
    path: 'selection-age/generique',
  },
  {
    name: 'OnboardingAgeInformation',
    component: ComponentForPathConfig,
    path: 'selection-age/information',
  },
  {
    name: 'OnboardingGeolocation',
    component: ComponentForPathConfig,
    path: 'geolocalisation',
  },
  {
    name: 'OnboardingGeneralPublicWelcome',
    component: ComponentForPathConfig,
    path: 'bienvenue-grand-public',
  },
  {
    name: 'OnboardingNotEligible',
    component: ComponentForPathConfig,
    path: 'non-eligible',
  },
  {
    name: 'OnboardingWelcome',
    component: ComponentForPathConfig,
    path: 'bienvenue',
  },
]
