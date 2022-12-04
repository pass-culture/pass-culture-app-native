import { NavigationOnboarding } from 'features/cheatcodes/pages/NavigationOnboarding/NavigationOnboarding'
import { OnboardingRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'
import { AgeInformation } from 'features/onboarding/pages/AgeInformation'
import { AgeSelection } from 'features/onboarding/pages/AgeSelection'
import { OnboardingAuthentication } from 'features/onboarding/pages/OnboardingAuthentication'

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
    name: 'NavigationOnboarding',
    component: NavigationOnboarding,
    path: 'cheat-navigation-onboarding',
  },
  {
    name: 'OnboardingAuthentication',
    component: OnboardingAuthentication,
    path: 'authentification',
    options: { title: 'Authentification' },
  },
]
