import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
import { BeneficiaryRequestSent } from 'features/identityCheck/pages/confirmation/BeneficiaryRequestSent'
import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { DisableActivation } from 'features/identityCheck/pages/DisableActivation'
import { DMSIntroduction } from 'features/identityCheck/pages/identification/dms/DMSIntroduction'
import { IdentityCheckDMS } from 'features/identityCheck/pages/identification/dms/IdentityCheckDMS'
import { EduConnectForm } from 'features/identityCheck/pages/identification/educonnect/EduConnectForm'
import { EduConnectValidation } from 'features/identityCheck/pages/identification/educonnect/EduConnectValidation'
import { withEduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectErrors } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrors'
import { IdentificationFork } from 'features/identityCheck/pages/identification/IdentificationFork'
import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { ComeBackLater } from 'features/identityCheck/pages/identification/ubble/ComeBackLater'
import { ExpiredOrLostID } from 'features/identityCheck/pages/identification/ubble/ExpiredOrLostID'
import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/ubble/IdentityCheckEnd'
import { IdentityCheckPending } from 'features/identityCheck/pages/identification/ubble/IdentityCheckPending'
import { SelectIDOrigin } from 'features/identityCheck/pages/identification/ubble/SelectIDOrigin'
import { SelectIDStatus } from 'features/identityCheck/pages/identification/ubble/SelectIDStatus'
import { SelectPhoneStatus } from 'features/identityCheck/pages/identification/ubble/SelectPhoneStatus.web'
import { UbbleWebview } from 'features/identityCheck/pages/identification/ubble/UbbleWebview'
import { PhoneValidationTooManyAttempts } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManyAttempts'
import { PhoneValidationTooManySMSSent } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManySMSSent'
import { SetPhoneNumber } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumber'
import { SetPhoneNumberWithoutValidation } from 'features/identityCheck/pages/phoneValidation/SetPhoneNumberWithoutValidation'
import { SetPhoneValidationCode } from 'features/identityCheck/pages/phoneValidation/SetPhoneValidationCode'
import { ProfileInformationValidation } from 'features/identityCheck/pages/profile/ProfileInformationValidation'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { SetStatus } from 'features/identityCheck/pages/profile/SetStatus'
import { Stepper } from 'features/identityCheck/pages/Stepper'
import {
  GenericRoute,
  SubscriptionRootStackParamList,
} from 'features/navigation/RootNavigator/types'

// Try to keep those routes in the same order as the user flow
export const subscriptionRoutes: GenericRoute<SubscriptionRootStackParamList>[] = [
  // Stepper
  {
    name: 'Stepper',
    component: Stepper,
    path: 'verification-identite',
    options: { title: 'Vérification d’identité' },
    secure: true,
  },
  // Other
  {
    name: 'DisableActivation',
    component: DisableActivation,
    path: 'creation-compte/desactivation',
    options: { title: 'Création de compte désactivé' },
  },
  // Phone Validation
  {
    name: 'SetPhoneNumberWithoutValidation',
    component: SetPhoneNumberWithoutValidation,
    path: 'creation-compte/telephone-sans-validation',
    options: { title: 'Ton numéro de téléphone' },
    secure: true,
  },
  {
    name: 'SetPhoneNumber',
    component: SetPhoneNumber,
    path: 'creation-compte/telephone',
    options: { title: 'Ton numéro de téléphone' },
    secure: true,
  },
  {
    name: 'SetPhoneValidationCode',
    component: SetPhoneValidationCode,
    path: 'creation-compte/code-de-validation-telephone',
    options: { title: 'Validation du numéro de téléphone' },
  },
  {
    name: 'PhoneValidationTooManyAttempts',
    component: PhoneValidationTooManyAttempts,
    path: 'creation-compte/code-de-validation-trop-d-essais',
    options: { title: 'Validation téléphone - Trop d’essais' },
  },
  {
    name: 'PhoneValidationTooManySMSSent',
    component: PhoneValidationTooManySMSSent,
    path: 'creation-compte/code-de-validation-trop-de-sms',
    options: { title: 'Validation téléphone - Trop de SMS envoyés' },
  },
  // Profile
  {
    name: 'SetName',
    component: SetName,
    path: 'creation-profil/nom-prenom',
    options: { title: 'Ton nom/prénom | Profil' },
    secure: true,
  },
  {
    name: 'SetCity',
    component: SetCity,
    path: 'creation-profil/ville',
    options: { title: 'Ton code postal | Profil' },
    secure: true,
  },
  {
    name: 'SetAddress',
    component: SetAddress,
    path: 'creation-profil/adresse',
    options: { title: 'Ton adresse | Profil' },
    secure: true,
  },
  {
    name: 'SetStatus',
    component: SetStatus,
    path: 'verification-identite/profil/statut',
    options: { title: 'Ton statut | Profil' },
    secure: true,
  },
  {
    name: 'SetProfileBookingError',
    component: SetProfileBookingError,
    path: 'verification-identite/profil/statut/erreur',
    options: { title: 'Erreur | Profil' },
    secure: true,
  },
  {
    name: 'ProfileInformationValidation',
    component: ProfileInformationValidation,
    path: 'verification-identite/profil/validation-informations',
    options: { title: 'Validation informations | Profil' },
    secure: true,
  },
  // Identification
  {
    name: 'UbbleWebview',
    component: UbbleWebview,
    path: 'identification/verification-manuelle-piece-identite',
    options: { title: 'Identification' },
    secure: true,
  },
  {
    name: 'EduConnectForm',
    component: EduConnectForm,
    path: 'educonnect-formulaire',
    options: { title: 'Identification avec EduConnect' },
  },
  {
    name: 'EduConnectValidation',
    component: EduConnectValidation,
    path: 'educonnect/validation',
    hoc: withEduConnectErrorBoundary,
    options: { title: 'Validation de l’identification' },
  },
  {
    name: 'IdentityCheckEnd',
    component: IdentityCheckEnd,
    path: 'verification-identite/fin',
    options: { title: 'Fin du parcours' },
    secure: true,
  },
  {
    name: 'IdentityCheckUnavailable',
    component: IdentityCheckUnavailable,
    path: 'verification-identite/verification-indisponible',
    options: { title: 'Victime de notre succès\u00a0!' },
    secure: true,
  },
  {
    name: 'IdentityCheckPending',
    component: IdentityCheckPending,
    path: 'verification-identite/demande-en-attente',
    options: { title: 'Demande en attente' },
  },
  {
    name: 'IdentityCheckDMS',
    component: IdentityCheckDMS,
    path: 'verification-identite/demarches-simplifiees',
    options: { title: 'Démarches-Simplifiées' },
  },
  {
    name: 'IdentificationFork',
    component: IdentificationFork,
    path: 'identification/fourche',
    options: { title: 'Identification' },
  },
  // Confirmation
  {
    name: 'IdentityCheckHonor',
    component: IdentityCheckHonor,
    path: 'confirmation',
    options: { title: 'Confirmation' },
    secure: true,
  },
  {
    name: 'BeneficiaryRequestSent',
    component: BeneficiaryRequestSent,
    path: 'demande-beneficiaire-envoyee',
    options: { title: 'Demande bénéficiaire envoyée' },
    secure: true,
  },
  {
    name: 'BeneficiaryAccountCreated',
    component: BeneficiaryAccountCreated,
    path: 'creation-compte/confirmation-beneficiaire',
    options: { title: 'Compte bénéficiaire créé\u00a0!' },
    secure: true,
  },
  // Errors
  {
    name: 'EduConnectErrors',
    component: EduConnectErrors,
    path: 'educonnect/erreur',
    options: { title: 'Erreur' },
  },
  // New Identification Flow
  {
    name: 'DMSIntroduction',
    component: DMSIntroduction,
    path: 'identification/redirection-demarches-simplifiees',
  },
  {
    name: 'ExpiredOrLostID',
    component: ExpiredOrLostID,
    path: 'identification/document-identite-perdu-ou-expire',
  },
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
  {
    name: 'SelectPhoneStatus',
    component: SelectPhoneStatus,
    path: 'identification/statut-telephone',
  },
  {
    name: 'ComeBackLater',
    component: ComeBackLater,
    path: 'identification/reviens-plus-tard',
  },
]
