import { TutorialRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'
import { AgeSelectionFork } from 'features/tutorial/pages/AgeSelectionFork'
import { AgeSelectionOther } from 'features/tutorial/pages/AgeSelectionOther'
import { EligibleUserAgeSelection } from 'features/tutorial/pages/EligibleUserAgeSelection'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { OnboardingGeneralPublicWelcome } from 'features/tutorial/pages/onboarding/OnboardingGeneralPublicWelcome'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { OnboardingNotEligible } from 'features/tutorial/pages/onboarding/OnboardingNotEligible'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'
import { ProfileTutorialAgeInformation } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformation'
import { ProfileTutorialAgeInformationCreditV3 } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformationCreditV3'

export const tutorialRoutes: GenericRoute<TutorialRootStackParamList>[] = [
  {
    name: 'AgeSelectionFork',
    component: AgeSelectionFork,
    path: 'selection-age/generique',
    options: { title: 'Sélection d’âge' },
  },
  {
    name: 'EligibleUserAgeSelection',
    component: EligibleUserAgeSelection,
    path: 'selection-age/eligible',
    options: { title: 'Sélection d’âge éligible' },
  },
  {
    name: 'AgeSelectionOther',
    component: AgeSelectionOther,
    path: 'selection-age/autre',
    options: { title: 'Sélection d’âge' },
  },
  {
    name: 'OnboardingAgeInformation',
    component: OnboardingAgeInformation,
    path: 'selection-age/information',
    options: { title: 'Information d’âge' },
  },
  {
    name: 'OnboardingGeolocation',
    component: OnboardingGeolocation,
    path: 'geolocalisation',
    options: { title: 'Active ta géolocalisation' },
  },
  {
    name: 'OnboardingGeneralPublicWelcome',
    component: OnboardingGeneralPublicWelcome,
    path: 'bienvenue-grand-public',
    options: { title: 'Bienvenue' },
  },
  {
    name: 'OnboardingNotEligible',
    component: OnboardingNotEligible,
    path: 'non-eligible',
    options: { title: 'Encore un peu de patience' },
  },
  {
    name: 'OnboardingWelcome',
    component: OnboardingWelcome,
    path: 'bienvenue',
    options: { title: 'Bienvenue' },
  },
  {
    name: 'ProfileTutorialAgeInformation',
    component: ProfileTutorialAgeInformation,
    path: 'tutoriel/selection-age/eligible',
    options: { title: 'Information d’âge' },
  },
  {
    name: 'ProfileTutorialAgeInformationCreditV3',
    component: ProfileTutorialAgeInformationCreditV3,
    path: 'tutoriel/selection-age/generique',
    options: { title: 'Information d’âge' },
  },
]
