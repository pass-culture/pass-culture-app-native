import { NavigationOnboarding } from 'features/internal/cheatcodes/pages/NavigationTutorial/NavigationOnboarding'
import { NavigationProfileTutorial } from 'features/internal/cheatcodes/pages/NavigationTutorial/NavigationProfileTutorial'
import { NavigationTutorial } from 'features/internal/cheatcodes/pages/NavigationTutorial/NavigationTutorial'
import { TutorialRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'
import { AgeSelection } from 'features/tutorial/pages/AgeSelection'
import { AgeSelectionOther } from 'features/tutorial/pages/AgeSelectionOther'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'
import { ProfileTutorialAgeInformation } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformation'

export const tutorialRoutes: GenericRoute<TutorialRootStackParamList>[] = [
  {
    name: 'AgeSelection',
    component: AgeSelection,
    path: 'selection-age',
    options: { title: 'Sélection d’âge' },
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
    path: 'selection-age/eligible',
    options: { title: 'Information d’âge' },
  },
  {
    name: 'OnboardingGeolocation',
    component: OnboardingGeolocation,
    path: 'geolocalisation',
    options: { title: 'Active ta géolocalisation' },
  },
  {
    name: 'OnboardingWelcome',
    component: OnboardingWelcome,
    path: 'bienvenue',
    options: { title: 'Bienvenue' },
  },
  {
    name: 'CheatcodeNavigationTutorial',
    component: NavigationTutorial,
    path: 'cheat-navigation-tutorial',
  },
  {
    name: 'CheatcodeNavigationOnboarding',
    component: NavigationOnboarding,
    path: 'cheat-navigation-onboarding',
  },
  {
    name: 'CheatcodeNavigationProfileTutorial',
    component: NavigationProfileTutorial,
    path: 'cheat-navigation-profile-tutorial',
  },
  {
    name: 'ProfileTutorialAgeInformation',
    component: ProfileTutorialAgeInformation,
    path: 'tutoriel/selection-age/eligible',
    options: { title: 'Information d’âge' },
  },
]
