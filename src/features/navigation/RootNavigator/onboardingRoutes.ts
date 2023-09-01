import { NavigationOnboarding } from 'features/internal/cheatcodes/pages/NavigationOnboarding/NavigationOnboarding'
import { OnboardingRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'
import { AgeSelection } from 'features/tutorial/pages/AgeSelection'
import { AgeSelectionOther } from 'features/tutorial/pages/AgeSelectionOther'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'

export const onboardingRoutes: GenericRoute<OnboardingRootStackParamList>[] = [
  {
    name: 'OnboardingAgeInformation',
    component: OnboardingAgeInformation,
    path: 'selection-age/eligible',
    options: { title: 'Information d’âge' },
  },
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
    name: 'NavigationOnboarding',
    component: NavigationOnboarding,
    path: 'cheat-navigation-onboarding',
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
]
