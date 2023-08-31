import { NavigationOnboarding } from 'features/internal/cheatcodes/pages/NavigationOnboarding/NavigationOnboarding'
import { OnboardingRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'
import { AgeSelectionOther } from 'features/tutorial/pages/AgeSelectionOther'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { OnboardingAgeSelection } from 'features/tutorial/pages/onboarding/OnboardingAgeSelection'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'

export const onboardingRoutes: GenericRoute<OnboardingRootStackParamList>[] = [
  {
    name: 'AgeInformation',
    component: OnboardingAgeInformation,
    path: 'selection-age/eligible',
    options: { title: 'Information d’âge' },
  },
  {
    name: 'AgeSelection',
    component: OnboardingAgeSelection,
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
