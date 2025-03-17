import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import { TutorialRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'

export const tutorialRoutes: GenericRoute<TutorialRootStackParamList>[] = [
  {
    name: 'AgeSelectionFork',
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
  {
    name: 'ProfileTutorialAgeInformationCredit',
    component: ComponentForPathConfig,
    path: 'tutoriel/selection-age/generique',
  },
]
