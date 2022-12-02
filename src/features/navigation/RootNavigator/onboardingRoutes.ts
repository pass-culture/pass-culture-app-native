import { NavigationOnboarding } from 'features/cheatcodes/pages/NavigationOnboarding/NavigationOnboarding'
import { OnboardingRootStackParamList, GenericRoute } from 'features/navigation/RootNavigator/types'
import { AgeSelection } from 'features/onboarding/pages/AgeSelection'
import { OnboardingAuthentication } from 'features/onboarding/pages/OnboardingAuthentication'

export const onboardingRoutes: GenericRoute<OnboardingRootStackParamList>[] = [
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
