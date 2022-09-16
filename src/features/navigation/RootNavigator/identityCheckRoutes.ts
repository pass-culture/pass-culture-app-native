import { t } from '@lingui/macro'

import { NavigationSignUp } from 'features/cheatcodes/pages/NavigationSignUp'
import { NavigationIdentityCheck } from 'features/cheatcodes/pages/NavigationSignUp/NavigationIdentityCheck'
import { NewIdentificationFlow } from 'features/cheatcodes/pages/NavigationSignUp/NavigationIdentityCheck/NewIdentificationFlow/NewIdentificationFlow'
import { withAsyncErrorBoundary } from 'features/errors'
import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { BeneficiaryRequestSent } from 'features/identityCheck/pages/confirmation/BeneficiaryRequestSent'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { IdentityCheckDMS } from 'features/identityCheck/pages/identification/dms/IdentityCheckDMS'
import { IdentityCheckEduConnect } from 'features/identityCheck/pages/identification/educonnect/IdentityCheckEduConnect'
import { IdentityCheckEduConnectForm } from 'features/identityCheck/pages/identification/educonnect/IdentityCheckEduConnectForm'
import { IdentityCheckValidation } from 'features/identityCheck/pages/identification/educonnect/IdentityCheckValidation'
import { withEduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectErrors } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrors'
import { IdentityCheckStart } from 'features/identityCheck/pages/identification/identificationStart/IdentityCheckStart'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/identificationStart/SelectIDOrigin'
import { SelectIDStatus } from 'features/identityCheck/pages/identification/identificationStart/SelectIDStatus'
import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/ubble/IdentityCheckEnd'
import { IdentityCheckPending } from 'features/identityCheck/pages/identification/ubble/IdentityCheckPending'
import { IdentityCheckWebview } from 'features/identityCheck/pages/identification/ubble/IdentityCheckWebview'
import {
  PhoneValidationTooManyAttempts,
  PhoneValidationTooManySMSSent,
} from 'features/identityCheck/pages/phoneValidation/errors'
import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { SetPhoneValidationCode } from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { SetSchoolType } from 'features/identityCheck/pages/profile/SetSchoolType'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { IdentityCheckStepper } from 'features/identityCheck/pages/Stepper'
import {
  GenericRoute,
  IdentityCheckRootStackParamList,
} from 'features/navigation/RootNavigator/types'

// Try to keep those routes in the same order as the user flow
export const identityCheckRoutes: GenericRoute<IdentityCheckRootStackParamList>[] = [
  {
    // debug route: in navigation component
    name: 'NavigationSignUp',
    component: NavigationSignUp,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-sign-up',
  },
  {
    // debug route: in navigation component
    name: 'NavigationIdentityCheck',
    component: NavigationIdentityCheck,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-identity-check',
  },
  {
    // debug route: in navigation component
    name: 'NewIdentificationFlow',
    component: NewIdentificationFlow,
    hoc: withAsyncErrorBoundary,
    path: 'cheat-navigation-new-identification-flow',
  },
  // Stepper
  {
    name: 'IdentityCheckStepper',
    component: IdentityCheckStepper,
    path: 'verification-identite',
    options: { title: t`Vérification d'identité` },
    secure: true,
  },
  // Phone Validation
  {
    name: 'SetPhoneNumber',
    component: SetPhoneNumber,
    path: 'creation-compte/telephone',
    options: { title: t`Ton numéro de téléphone` },
    secure: true,
  },
  {
    name: 'SetPhoneValidationCode',
    component: SetPhoneValidationCode,
    path: 'creation-compte/code-de-validation-telephone',
    options: { title: t`Validation du numéro de téléphone` },
  },
  {
    name: 'PhoneValidationTooManyAttempts',
    component: PhoneValidationTooManyAttempts,
    path: 'creation-compte/code-de-validation-trop-d-essais',
    options: { title: t`Validation téléphone - Trop d'essais` },
  },
  {
    name: 'PhoneValidationTooManySMSSent',
    component: PhoneValidationTooManySMSSent,
    path: 'creation-compte/code-de-validation-trop-de-sms',
    options: { title: t`Validation téléphone - Trop de SMS envoyés` },
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
    component: SetStatus,
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
    name: 'BeneficiaryAccountCreated',
    component: BeneficiaryAccountCreated,
    path: 'creation-compte/confirmation-beneficiaire',
    options: { title: t`Compte bénéficiaire créé\u00a0!` },
    secure: true,
  },
  // Errors
  {
    name: 'EduConnectErrors',
    component: EduConnectErrors,
    path: 'educonnect/erreur',
    options: { title: t`Erreur` },
  },
  // New Identification Flow
  {
    name: 'SelectIDOrigin',
    component: SelectIDOrigin,
    path: 'identification/origine-document-identite',
  },
  {
    name: 'SelectIDStatus',
    component: SelectIDStatus,
    path: 'identification/statut-document-identite',
  },
]
