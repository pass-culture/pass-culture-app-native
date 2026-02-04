import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import React from 'react'

import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { ProfileStackNavigatorBase } from 'features/navigation/ProfileStackNavigator/ProfileStackNavigatorBase'
import { ProfileStackRouteName } from 'features/navigation/ProfileStackNavigator/ProfileStackTypes'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityDeclarationMobileAndroid } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileAndroid'
import { AccessibilityDeclarationMobileIOS } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileIOS'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { SiteMapScreen } from 'features/profile/pages/Accessibility/SiteMapScreen'
import { Appearance } from 'features/profile/pages/Appearance/Appearance'
import { ChangeAddress } from 'features/profile/pages/ChangeAddress/ChangeAddress'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { Chatbot } from 'features/profile/pages/Chatbot/Chatbot'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { DebugScreen } from 'features/profile/pages/DebugScreen/DebugScreen'
import { ConfirmDeleteProfile } from 'features/profile/pages/DeleteProfile/ConfirmDeleteProfile'
import { DeactivateProfileSuccess } from 'features/profile/pages/DeleteProfile/DeactivateProfileSuccess'
import { DeleteProfileAccountHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountHacked'
import { DeleteProfileAccountNotDeletable } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountNotDeletable'
import { DeleteProfileConfirmation } from 'features/profile/pages/DeleteProfile/DeleteProfileConfirmation'
import { DeleteProfileContactSupport } from 'features/profile/pages/DeleteProfile/DeleteProfileContactSupport'
import { DeleteProfileEmailHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileEmailHacked'
import { SuspendAccountConfirmationWithoutAuthentication } from 'features/profile/pages/DeleteProfile/SuspendAccountConfirmationWithoutAuthentication'
import { DeleteProfileReason } from 'features/profile/pages/DeleteProfileReason/DeleteProfileReason'
import { FeedbackInApp } from 'features/profile/pages/FeedbackInApp/FeedbackInApp'
import { LegalNotices } from 'features/profile/pages/LegalNotices/LegalNotices'
import { MandatoryUpdatePersonalData } from 'features/profile/pages/MandatoryUpdatePersonalData/MandatoryUpdatePersonalData'
import { ProfileInformationValidationUpdate } from 'features/profile/pages/MandatoryUpdatePersonalData/ProfileInformationValidationUpdate'
import { UpdatePersonalDataConfirmation } from 'features/profile/pages/MandatoryUpdatePersonalData/UpdatePersonalDataConfirmation'
import { NewEmailSelection } from 'features/profile/pages/NewEmailSelection/NewEmailSelection'
import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { PersonalData } from 'features/profile/pages/PersonalData/PersonalData'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { ProfileTutorialAgeInformationCredit } from 'features/profile/pages/TutorialAgeInformationCredit/ProfileTutorialAgeInformationCredit'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'

type ProfileRouteConfig = {
  name: ProfileStackRouteName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  options?: NativeStackNavigationOptions
}

const profileScreens: ProfileRouteConfig[] = [
  { name: 'Accessibility', component: Accessibility, options: { title: 'Accessibilité' } },
  {
    name: 'AccessibilityDeclarationMobileAndroid',
    component: AccessibilityDeclarationMobileAndroid,
    options: { title: 'Déclaration d’accessibilité - Android' },
  },
  {
    name: 'AccessibilityDeclarationMobileIOS',
    component: AccessibilityDeclarationMobileIOS,
    options: { title: 'Déclaration d’accessibilité - iOS' },
  },
  {
    name: 'AccessibilityDeclarationWeb',
    component: AccessibilityDeclarationWeb,
    options: { title: 'Déclaration d’accessibilité - web' },
  },
  {
    name: 'Chatbot',
    component: Chatbot,
    options: { title: 'Chatbot' },
  },
  {
    name: 'RecommendedPaths',
    component: RecommendedPaths,
    options: { title: 'Parcours recommandés' },
  },
  { name: 'SiteMapScreen', component: SiteMapScreen, options: { title: 'Plan du site' } },
  {
    name: 'NotificationsSettings',
    component: NotificationsSettings,
    options: { title: 'Réglages de notifications' },
  },
  {
    name: 'DeleteProfileReason',
    component: withAuthProtection(DeleteProfileReason),
    options: { title: 'Raison de suppression de compte' },
  },
  {
    name: 'DeleteProfileContactSupport',
    component: withAuthProtection(DeleteProfileContactSupport),
    options: { title: 'Contact support' },
  },
  {
    name: 'DeleteProfileEmailHacked',
    component: withAuthProtection(DeleteProfileEmailHacked),
    options: { title: 'Sécurise ton compte' },
  },
  {
    name: 'DeleteProfileAccountHacked',
    component: withAuthProtection(DeleteProfileAccountHacked),
    options: { title: 'Sécurise ton compte' },
  },
  {
    name: 'DeleteProfileAccountNotDeletable',
    component: withAuthProtection(DeleteProfileAccountNotDeletable),
    options: { title: 'Compte non supprimable' },
  },
  {
    name: 'DebugScreen',
    component: DebugScreen,
    options: { title: 'Débuggage' },
  },
  {
    name: 'ConfirmDeleteProfile',
    component: withAuthProtection(ConfirmDeleteProfile),
    options: { title: 'Suppression de compte' },
  },
  {
    name: 'DeleteProfileConfirmation',
    component: DeleteProfileConfirmation,
    options: { title: 'Réglages de notifications' },
  },
  {
    name: 'DeactivateProfileSuccess',
    component: withAuthProtection(DeactivateProfileSuccess),
    options: { title: 'Désactivation profil confirmée' },
  },
  {
    name: 'SuspendAccountConfirmationWithoutAuthentication',
    component: withAuthProtection(SuspendAccountConfirmationWithoutAuthentication),
    options: { title: 'Suppression profil confirmation' },
  },
  {
    name: 'ChangeStatus',
    component: withAuthProtection(ChangeStatus),
    options: { title: 'Ton statut | Profil' },
  },
  {
    name: 'ChangeCity',
    component: withAuthProtection(ChangeCity),
    options: { title: 'Ton code postal | Profil' },
  },
  {
    name: 'ChangeAddress',
    component: withAuthProtection(ChangeAddress),
    options: { title: 'Ton adresse | Profil' },
  },
  {
    name: 'ChangeEmail',
    component: ChangeEmail,
    options: { title: 'Modification de l’e-mail' },
  },
  {
    name: 'TrackEmailChange',
    component: withAuthProtection(TrackEmailChange),
    options: { title: 'Suivi de ton changement d’e-mail' },
  },
  {
    name: 'LegalNotices',
    component: LegalNotices,
    options: { title: 'Informations légales' },
  },
  {
    name: 'PersonalData',
    component: withAuthProtection(PersonalData),
    options: { title: 'Mes informations personnelles' },
  },
  {
    name: 'ValidateEmailChange',
    component: ValidateEmailChange,
    options: { title: 'Confirmation de changement d’email ' },
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,
    options: { title: 'Modification du mot de passe' },
  },
  {
    name: 'SuspendAccountConfirmation',
    component: SuspendAccountConfirmation,
    options: { title: 'Suspension de compte' },
  },
  {
    name: 'ConsentSettings',
    component: ConsentSettings,
    options: { title: 'Paramètres de confidentialité' },
  },
  {
    name: 'ConfirmChangeEmail',
    component: ConfirmChangeEmail,
    options: { title: 'Confirmation de changement d’email ' },
  },
  {
    name: 'ChangeEmailSetPassword',
    component: withAuthProtection(ChangeEmailSetPassword),
    options: { title: 'Création du mot de passe' },
  },
  {
    name: 'NewEmailSelection',
    component: withAuthProtection(NewEmailSelection),
    options: { title: 'Nouvelle adresse e-mail' },
  },
  {
    name: 'FeedbackInApp',
    component: withAuthProtection(FeedbackInApp),
    options: { title: 'Formulaire de suggestion' },
  },
  {
    name: 'DisplayPreference',
    component: Appearance,
    options: { title: 'Préférence d’affichage' },
  },
  {
    name: 'ProfileTutorialAgeInformationCredit',
    component: ProfileTutorialAgeInformationCredit,
  },
  {
    name: 'MandatoryUpdatePersonalData',
    component: withAuthProtection(MandatoryUpdatePersonalData),
    options: { title: 'Confirmation de la validité de tes données personnelles' },
  },
  {
    name: 'UpdatePersonalDataConfirmation',
    component: withAuthProtection(UpdatePersonalDataConfirmation),
    options: { title: 'Confirmation de la validité de tes données personnelles' },
  },
  {
    name: 'ProfileInformationValidationUpdate',
    component: withAuthProtection(ProfileInformationValidationUpdate),
    options: { title: 'Vérification de la validité de tes données personnelles' },
  },
]

export const ProfileStackNavigator = () => (
  <ProfileStackNavigatorBase.Navigator
    initialRouteName="Accessibility"
    screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    {profileScreens.map(({ name, component, options }) => (
      <ProfileStackNavigatorBase.Screen
        key={name}
        name={name}
        component={withAsyncErrorBoundary(component)}
        options={options}
      />
    ))}
  </ProfileStackNavigatorBase.Navigator>
)
