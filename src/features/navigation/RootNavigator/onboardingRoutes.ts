import { NavigationOnboarding } from 'features/cheatcodes/pages/NavigationOnboarding/NavigationOnboarding'
import { OnboardingRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'
import { AgeInformation } from 'features/onboarding/pages/AgeInformation'
import { AgeSelection } from 'features/onboarding/pages/AgeSelection'
import { AgeSelectionOther } from 'features/onboarding/pages/AgeSelectionOther'
import { OnboardingGeolocation } from 'features/onboarding/pages/OnboardingGeolocation'
import { OnboardingWelcome } from 'features/onboarding/pages/OnboardingWelcome'

export const onboardingRoutes: GenericRoute<OnboardingRootStackParamList>[] = [
  {
    name: 'AgeInformation',
    component: AgeInformation,
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
