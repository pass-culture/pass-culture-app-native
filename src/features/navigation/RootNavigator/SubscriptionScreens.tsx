import React from 'react'

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
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { RootStack } from 'features/navigation/RootNavigator/Stack'
import {
  GenericRoute,
  SubscriptionRootStackParamList,
} from 'features/navigation/RootNavigator/types'

export const SubscriptionScreens = (
  <React.Fragment>
    <RootStack.Screen
      name="Stepper"
      component={withAuthProtection(Stepper)}
      options={{ title: 'Vérification d’identité' }}
    />
    <RootStack.Screen
      name="DisableActivation"
      component={DisableActivation}
      options={{ title: 'Création de compte désactivé' }}
    />
    <RootStack.Screen
      name="SetPhoneNumberWithoutValidation"
      component={withAuthProtection(SetPhoneNumberWithoutValidation)}
      options={{ title: 'Ton numéro de téléphone' }}
    />
    <RootStack.Screen
      name="SetPhoneNumber"
      component={withAuthProtection(SetPhoneNumber)}
      options={{ title: 'Ton numéro de téléphone' }}
    />
    <RootStack.Screen
      name="SetPhoneValidationCode"
      component={SetPhoneValidationCode}
      options={{ title: 'Validation du numéro de téléphone' }}
    />
    <RootStack.Screen
      name="PhoneValidationTooManyAttempts"
      component={PhoneValidationTooManyAttempts}
      options={{ title: 'Validation téléphone - Trop d’essais' }}
    />
    <RootStack.Screen
      name="PhoneValidationTooManySMSSent"
      component={PhoneValidationTooManySMSSent}
      options={{ title: 'Validation téléphone - Trop de SMS envoyés' }}
    />
    <RootStack.Screen
      name="SetName"
      component={SetName ?? withAuthProtection(SetName)}
      options={{ title: 'Ton nom/prénom | Profil' }}
    />
    <RootStack.Screen
      name="SetCity"
      component={SetCity ?? withAuthProtection(SetCity)}
      options={{ title: 'Ton code postal | Profil' }}
    />
    <RootStack.Screen
      name="SetAddress"
      component={SetAddress ?? withAuthProtection(SetAddress)}
      options={{ title: 'Ton adresse | Profil' }}
    />
    <RootStack.Screen
      name="SetStatus"
      component={SetStatus ?? withAuthProtection(SetStatus)}
      options={{ title: 'Ton statut | Profil' }}
    />
    <RootStack.Screen
      name="SetProfileBookingError"
      component={SetProfileBookingError ?? withAuthProtection(SetProfileBookingError)}
      options={{ title: 'Erreur | Profil' }}
    />
    <RootStack.Screen
      name="ProfileInformationValidation"
      component={ProfileInformationValidation ?? withAuthProtection(ProfileInformationValidation)}
      options={{ title: 'Validation informations | Profil' }}
    />
    <RootStack.Screen
      name="UbbleWebview"
      component={withAuthProtection(UbbleWebview)}
      options={{ title: 'Identification' }}
    />
    <RootStack.Screen
      name="EduConnectForm"
      component={EduConnectForm}
      options={{ title: 'Identification avec EduConnect' }}
    />
    <RootStack.Screen
      name="EduConnectValidation"
      component={withEduConnectErrorBoundary(EduConnectValidation)}
      options={{ title: 'Validation de l’identification' }}
    />
    <RootStack.Screen
      name="IdentityCheckEnd"
      component={withAuthProtection(IdentityCheckEnd)}
      options={{ title: 'Fin du parcours' }}
    />
  </React.Fragment>
)

// Try to keep those routes in the same order as the user flow
export const subscriptionRoutes: GenericRoute<SubscriptionRootStackParamList>[] = [
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
