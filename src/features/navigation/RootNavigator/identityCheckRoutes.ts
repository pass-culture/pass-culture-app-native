import { t } from '@lingui/macro'

import { NavigationIdentityCheck } from 'features/cheatcodes/pages/NavigationIdentityCheck'
import { withAsyncErrorBoundary } from 'features/errors'
import { withEduConnectErrorBoundary } from 'features/identityCheck/errors/eduConnect/EduConnectErrorBoundary'
import { BeneficiaryRequestSent } from 'features/identityCheck/pages/confirmation/BeneficiaryRequestSent'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { UnderageAccountCreated } from 'features/identityCheck/pages/confirmation/UnderageAccountCreated'
import { EduConnectErrors } from 'features/identityCheck/pages/errors/EduConnectErrors'
import { IdentityCheckDMS } from 'features/identityCheck/pages/identification/IdentityCheckDMS'
import { IdentityCheckEduConnect } from 'features/identityCheck/pages/identification/IdentityCheckEduConnect'
import { IdentityCheckEduConnectForm } from 'features/identityCheck/pages/identification/IdentityCheckEduConnectForm'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/IdentityCheckEnd'
import { IdentityCheckPending } from 'features/identityCheck/pages/identification/IdentityCheckPending'
import { IdentityCheckStart } from 'features/identityCheck/pages/identification/IdentityCheckStart/IdentityCheckStart'
import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { IdentityCheckValidation } from 'features/identityCheck/pages/identification/IdentityCheckValidation'
import { IdentityCheckWebview } from 'features/identityCheck/pages/identification/IdentityCheckWebview'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { Status } from 'features/identityCheck/pages/profile/Status'
import { IdentityCheckStepper } from 'features/identityCheck/pages/Stepper'
import {
  GenericRoute,
  IdentityCheckRootStackParamList,
} from 'features/navigation/RootNavigator/types'

// Try to keep those routes in the same order as the user flow
export const identityCheckRoutes: GenericRoute<IdentityCheckRootStackParamList>[] = [
  {
    // debug route: in navigation component
    name: 'NavigationIdentityCheck',
    component: NavigationIdentityCheck,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-identity-check',
  },
  // Stepper
  {
    name: 'IdentityCheckStepper',
    component: IdentityCheckStepper,
    path: 'verification-identite',
    options: { title: t`Vérification d'identité` },
    secure: true,
  },
  // Profile
  {
    name: 'SetName',
    component: SetName,
    path: 'creation-profil/nom-prenom',
    options: { title: t`Ton nom/prénom | Profil` },
    secure: true,
  },
  {
    name: 'IdentityCheckCity',
    component: SetCity,
    path: 'creation-profil/ville',
    options: { title: t`Ton code postal | Profil` },
    secure: true,
  },
  {
    name: 'IdentityCheckAddress',
    component: SetAddress,
    path: 'creation-profil/adresse',
    options: { title: t`Ton adresse | Profil` },
    secure: true,
  },
  {
    name: 'IdentityCheckStatus',
    component: Status,
    path: 'verification-identite/profil/statut',
    options: { title: t`Ton status | Profil` },
    secure: true,
  },
  {
    name: 'IdentityCheckSchoolType',
    component: SetSchoolType,
    path: 'verification-identite/profil/type-etablissement',
    options: { title: t`Ton établissement | Profil` },
    secure: true,
  },
  // Identification
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
    name: 'IdentityCheckEduConnect',
    component: IdentityCheckEduConnect,
    path: 'educonnect',
    options: { title: t`Identification` },
    secure: false,
  },
  {
    name: 'IdentityCheckEduConnectForm',
    component: IdentityCheckEduConnectForm,
    path: 'educonnect-formulaire',
    options: { title: t`Identification avec EduConnect` },
  },
  {
    name: 'IdentityCheckValidation',
    component: IdentityCheckValidation,
    path: 'educonnect/validation',
    hoc: withEduConnectErrorBoundary,
    options: { title: t`Validation de l'identification` },
  },
  {
    name: 'IdentityCheckEnd',
    component: IdentityCheckEnd,
    path: 'verification-identite/fin',
    options: { title: t`Fin du parcours` },
    secure: true,
  },
  {
    name: 'IdentityCheckUnavailable',
    component: IdentityCheckUnavailable,
    path: 'verification-identite/verification-indisponible',
    options: { title: t`Victime de notre succès\u00a0!` },
    secure: true,
  },
  {
    name: 'IdentityCheckPending',
    component: IdentityCheckPending,
    path: 'verification-identite/demande-en-attente',
    options: { title: t`Demande en attente` },
  },
  {
    name: 'IdentityCheckDMS',
    component: IdentityCheckDMS,
    path: 'verification-identite/demarches-simplifiees',
    options: { title: t`Démarches-Simplifiées` },
  },
  // Confirmation
  {
    name: 'IdentityCheckHonor',
    component: IdentityCheckHonor,
    path: 'confirmation',
    options: { title: t`Confirmation` },
    secure: true,
  },
  {
    name: 'BeneficiaryRequestSent',
    component: BeneficiaryRequestSent,
    path: 'demande-beneficiaire-envoyee',
    options: { title: t`Demande bénéficiaire envoyée` },
    secure: true,
  },
  {
    name: 'UnderageAccountCreated',
    component: UnderageAccountCreated,
    path: 'creation-compte/confirmation-15-17',
    options: { title: t`Compte 15-17 créé\u00a0!` },
    secure: true,
  },
  // Errors
  {
    name: 'EduConnectErrors',
    component: EduConnectErrors,
    path: 'educonnect/erreur',
    options: { title: t`Erreur` },
  },
]
