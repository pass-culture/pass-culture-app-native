import { StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'

import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { ProfileStackNavigatorBase } from 'features/navigation/ProfileStackNavigator/ProfileStackNavigatorBase'
import { ProfileStackRouteName } from 'features/navigation/ProfileStackNavigator/ProfileStackTypes'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { AccessibilityDeclarationMobile } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobile'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { SiteMapScreen } from 'features/profile/pages/Accessibility/SiteMapScreen'
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import { ChangePassword } from 'features/profile/pages/ChangePassword'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
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
import { DisplayPreference } from 'features/profile/pages/DisplayPreference/DisplayPreference'
import { FeedbackInApp } from 'features/profile/pages/FeedbackInApp/FeedbackInApp'
import { LegalNotices } from 'features/profile/pages/LegalNotices/LegalNotices'
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
  options: StackNavigationOptions
}

const profileScreens: ProfileRouteConfig[] = [
  { name: 'Accessibility', component: Accessibility, options: { title: 'Accessibilité' } },
  {
    name: 'AccessibilityEngagement',
    component: AccessibilityEngagement,
    options: { title: 'Engagement' },
  },
  {
    name: 'AccessibilityActionPlan',
    component: AccessibilityActionPlan,
    options: { title: 'Plan d’actions' },
  },
  {
    name: 'AccessibilityDeclarationMobile',
    component: AccessibilityDeclarationMobile,
    options: { title: 'Déclaration d’accessibilité des applications iOS et Android' },
  },
  {
    name: 'AccessibilityDeclarationWeb',
    component: AccessibilityDeclarationWeb,
    options: { title: 'Déclaration d’accessibilité de la version web' },
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
    component: withAuthProtection(DebugScreen),
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
    component: DisplayPreference,
    options: { title: 'Préférence d’affichage' },
  },
  {
    name: 'ProfileTutorialAgeInformationCredit',
    component: ProfileTutorialAgeInformationCredit,
    options: { title: 'Préférence d’affichage' },
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
