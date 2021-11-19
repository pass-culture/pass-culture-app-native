import { t } from '@lingui/macro'

import { NavigationIdentityCheck } from 'features/cheatcodes/pages/NavigationIdentityCheck'
import { IdentityCheckStart } from 'features/identityCheck/pages/identification/IdentityCheckStart'
import { IdentityCheckWebview } from 'features/identityCheck/pages/identification/IdentityCheckWebview'
import { IdentityCheckEnd } from 'features/identityCheck/pages/IdentityCheckEnd'
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
  {
    name: 'IdentityCheckStart',
    component: IdentityCheckStart,
    path: 'verification-identite/identification',
    options: { title: t`Identification` },
    secure: true,
  },
  {
    name: 'IdentityCheckWebview',
    component: IdentityCheckWebview,
    path: 'verification-identite/parcours',
    options: { title: t`Identification` },
    secure: true,
  },
  {
    name: 'IdentityCheckEnd',
    component: IdentityCheckEnd,
    path: 'verification-identite/fin',
    options: { title: t`Fin du parcours` },
    secure: true,
  },
]
