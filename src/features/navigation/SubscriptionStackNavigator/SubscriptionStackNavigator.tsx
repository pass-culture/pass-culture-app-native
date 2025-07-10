import { StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'

import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { FAQWebview } from 'features/culturalSurvey/pages/FAQWebview'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
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
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { SubscriptionStackNavigatorBase } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackNavigatorBase'
import { SubscriptionStackRouteName } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

type SubscriptionRouteConfig = {
  name: SubscriptionStackRouteName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  options?: StackNavigationOptions
}

const subscriptionScreens: SubscriptionRouteConfig[] = [
  {
    name: 'Stepper',
    component: withAuthProtection(Stepper),
    options: { title: 'Vérification d’identité' },
  },
  {
    name: 'DisableActivation',
    component: DisableActivation,
    options: { title: 'Création de compte désactivé' },
  },
  {
    name: 'SetPhoneNumberWithoutValidation',
    component: withAuthProtection(SetPhoneNumberWithoutValidation),
    options: { title: 'Ton numéro de téléphone' },
  },
  {
    name: 'SetPhoneNumber',
    component: withAuthProtection(SetPhoneNumber),
    options: { title: 'Ton numéro de téléphone' },
  },
  {
    name: 'SetPhoneValidationCode',
    component: SetPhoneValidationCode,
    options: { title: 'Validation du numéro de téléphone' },
  },
  {
    name: 'PhoneValidationTooManyAttempts',
    component: PhoneValidationTooManyAttempts,
    options: { title: 'Validation téléphone - Trop d’essais' },
  },
  {
    name: 'PhoneValidationTooManySMSSent',
    component: PhoneValidationTooManySMSSent,
    options: { title: 'Validation téléphone - Trop de SMS envoyés' },
  },
  {
    name: 'SetName',
    component: withAuthProtection(SetName),
    options: { title: 'Ton nom/prénom | Profil' },
  },
  {
    name: 'SetCity',
    component: withAuthProtection(SetCity),
    options: { title: 'Ton code postal | Profil' },
  },
  {
    name: 'SetAddress',
    component: withAuthProtection(SetAddress),
    options: { title: 'Ton adresse | Profil' },
  },
  {
    name: 'SetStatus',
    component: withAuthProtection(SetStatus),
    options: { title: 'Ton statut | Profil' },
  },
  {
    name: 'SetProfileBookingError',
    component: withAuthProtection(SetProfileBookingError),
    options: { title: 'Erreur | Profil' },
  },
  {
    name: 'ProfileInformationValidation',
    component: withAuthProtection(ProfileInformationValidation),
    options: { title: 'Validation informations | Profil' },
  },
  {
    name: 'UbbleWebview',
    component: withAuthProtection(UbbleWebview),
    options: { title: 'Identification' },
  },
  {
    name: 'EduConnectForm',
    component: EduConnectForm,
    options: { title: 'Identification avec EduConnect' },
  },
  {
    name: 'EduConnectValidation',
    component: withEduConnectErrorBoundary(EduConnectValidation),
    options: { title: 'Validation de l’identification' },
  },
  {
    name: 'IdentityCheckEnd',
    component: withAuthProtection(IdentityCheckEnd),
    options: { title: 'Fin du parcours' },
  },
  {
    name: 'IdentityCheckUnavailable',
    component: withAuthProtection(IdentityCheckUnavailable),
    options: { title: 'Victime de notre succès\u00a0!' },
  },
  {
    name: 'IdentityCheckPending',
    component: IdentityCheckPending,
    options: { title: 'Demande en attente' },
  },
  {
    name: 'IdentityCheckDMS',
    component: IdentityCheckDMS,
    options: { title: 'Démarches-Simplifiées' },
  },
  {
    name: 'IdentificationFork',
    component: IdentificationFork,
    options: { title: 'Identification' },
  },
  {
    name: 'IdentityCheckHonor',
    component: withAuthProtection(IdentityCheckHonor),
    options: { title: 'Confirmation' },
  },
  {
    name: 'BeneficiaryRequestSent',
    component: withAuthProtection(BeneficiaryRequestSent),
    options: { title: 'Demande bénéficiaire envoyée' },
  },
  {
    name: 'BeneficiaryAccountCreated',
    component: withAuthProtection(BeneficiaryAccountCreated),
    options: { title: 'Compte bénéficiaire créé\u00a0!' },
  },
  {
    name: 'EduConnectErrors',
    component: EduConnectErrors,
    options: { title: 'Erreur' },
  },
  { name: 'DMSIntroduction', component: DMSIntroduction },
  { name: 'ExpiredOrLostID', component: ExpiredOrLostID },
  { name: 'SelectIDOrigin', component: SelectIDOrigin },
  { name: 'SelectIDStatus', component: SelectIDStatus },
  { name: 'SelectPhoneStatus', component: SelectPhoneStatus },
  { name: 'ComeBackLater', component: ComeBackLater },
  // CulturalSurvey routes
  {
    name: 'CulturalSurveyIntro',
    component: withAuthProtection(CulturalSurveyIntro),
    options: { title: 'Prenons 1 minute' },
  },
  {
    name: 'CulturalSurveyQuestions',
    component: withAuthProtection(CulturalSurveyQuestions),
  },
  {
    name: 'CulturalSurveyThanks',
    component: withAuthProtection(CulturalSurveyThanks),
  },
  { name: 'FAQWebview', component: FAQWebview },
]

export const SubscriptionStackNavigator = () => (
  <SubscriptionStackNavigatorBase.Navigator
    initialRouteName="Stepper"
    screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    {subscriptionScreens.map(({ name, component, options }) => (
      <SubscriptionStackNavigatorBase.Screen
        key={name}
        name={name}
        component={withAsyncErrorBoundary(component)}
        options={options}
      />
    ))}
  </SubscriptionStackNavigatorBase.Navigator>
)
