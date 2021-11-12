import { t } from '@lingui/macro'

import { NavigationIdentityCheck } from 'features/cheatcodes/pages/NavigationIdentityCheck'
import { Status } from 'features/identityCheck/pages/profile/Status'
import { IdentityCheckStepper } from 'features/identityCheck/pages/Stepper'
import { GenericRoute, IdentityCheckRootStackParamList } from 'features/navigation/RootNavigator'

export const identityCheckRoutes: GenericRoute<IdentityCheckRootStackParamList>[] = [
  {
    // debug route: in navigation component
    name: 'NavigationIdentityCheck',
    component: NavigationIdentityCheck,
    path: 'cheat-navigation-identity-check',
  },
  {
    name: 'IdentityCheck',
    component: IdentityCheckStepper,
    path: 'verification-identite',
    options: { title: t`Vérification d'identité` },
    secure: true,
  },
  {
    name: 'IdentityCheckStatus',
    component: Status,
    path: 'verification-identite/profil/statut',
    options: { title: t`Choix du status` },
    secure: true,
  },
]
