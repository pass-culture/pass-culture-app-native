import React from 'react'

import { ProfileStack } from 'features/navigation/ProfileStackNavigator/ProfileStack'
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

export const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    initialRouteName="Accessibility"
    screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    <ProfileStack.Screen
      name="Accessibility"
      component={Accessibility}
      options={{ title: 'Accessibilité' }}
    />
    <ProfileStack.Screen
      name="AccessibilityEngagement"
      component={AccessibilityEngagement}
      options={{ title: 'Engagement' }}
    />
    <ProfileStack.Screen
      name="AccessibilityActionPlan"
      component={AccessibilityActionPlan}
      options={{ title: 'Plan d’actions' }}
    />
    <ProfileStack.Screen
      name="AccessibilityDeclarationMobile"
      component={AccessibilityDeclarationMobile}
      options={{ title: 'Déclaration d’accessibilité des applications iOS et Android' }}
    />
    <ProfileStack.Screen
      name="AccessibilityDeclarationWeb"
      component={AccessibilityDeclarationWeb}
      options={{ title: 'Déclaration d’accessibilité de la version web' }}
    />
    <ProfileStack.Screen
      name="RecommendedPaths"
      component={RecommendedPaths}
      options={{ title: 'Parcours recommandés' }}
    />
    <ProfileStack.Screen
      name="SiteMapScreen"
      component={SiteMapScreen}
      options={{ title: 'Plan du site' }}
    />
    <ProfileStack.Screen
      name="NotificationsSettings"
      component={NotificationsSettings}
      options={{ title: 'Réglages de notifications' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileReason"
      component={withAuthProtection(DeleteProfileReason)}
      options={{ title: 'Raison de suppression de compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileContactSupport"
      component={withAuthProtection(DeleteProfileContactSupport)}
      options={{ title: 'Contact support' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileEmailHacked"
      component={withAuthProtection(DeleteProfileEmailHacked)}
      options={{ title: 'Sécurise ton compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileAccountHacked"
      component={withAuthProtection(DeleteProfileAccountHacked)}
      options={{ title: 'Sécurise ton compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileAccountNotDeletable"
      component={withAuthProtection(DeleteProfileAccountNotDeletable)}
      options={{ title: 'Compte non supprimable' }}
    />
    <ProfileStack.Screen
      name="DebugScreen"
      component={withAuthProtection(DebugScreen)}
      options={{ title: 'Débuggage' }}
    />
    <ProfileStack.Screen
      name="ConfirmDeleteProfile"
      component={withAuthProtection(ConfirmDeleteProfile)}
      options={{ title: 'Suppression de compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileConfirmation"
      component={DeleteProfileConfirmation}
      options={{ title: 'Réglages de notifications' }}
    />
    <ProfileStack.Screen
      name="DeactivateProfileSuccess"
      component={withAuthProtection(DeactivateProfileSuccess)}
      options={{ title: 'Désactivation profil confirmée' }}
    />
    <ProfileStack.Screen
      name="SuspendAccountConfirmationWithoutAuthentication"
      component={withAuthProtection(SuspendAccountConfirmationWithoutAuthentication)}
      options={{ title: 'Suppression profil confirmation' }}
    />
    <ProfileStack.Screen
      name="ChangeStatus"
      component={withAuthProtection(ChangeStatus)}
      options={{ title: 'Ton statut | Profil' }}
    />
    <ProfileStack.Screen
      name="ChangeCity"
      component={withAuthProtection(ChangeCity)}
      options={{ title: 'Ton code postal | Profil' }}
    />
    <ProfileStack.Screen
      name="ChangeEmail"
      component={ChangeEmail}
      options={{ title: 'Modification de l’e-mail' }}
    />
    <ProfileStack.Screen
      name="TrackEmailChange"
      component={withAuthProtection(TrackEmailChange)}
      options={{ title: 'Suivi de ton changement d’e-mail' }}
    />
    <ProfileStack.Screen
      name="LegalNotices"
      component={LegalNotices}
      options={{ title: 'Informations légales' }}
    />
    <ProfileStack.Screen
      name="PersonalData"
      component={withAuthProtection(PersonalData)}
      options={{ title: 'Mes informations personnelles' }}
    />
    <ProfileStack.Screen
      name="ValidateEmailChange"
      component={ValidateEmailChange}
      options={{ title: 'Confirmation de changement d’email ' }}
    />
    <ProfileStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{ title: 'Modification du mot de passe' }}
    />
    <ProfileStack.Screen
      name="SuspendAccountConfirmation"
      component={SuspendAccountConfirmation}
      options={{ title: 'Suspension de compte' }}
    />
    <ProfileStack.Screen
      name="ConsentSettings"
      component={ConsentSettings}
      options={{ title: 'Paramètres de confidentialité' }}
    />
    <ProfileStack.Screen
      name="ConfirmChangeEmail"
      component={ConfirmChangeEmail}
      options={{ title: 'Confirmation de changement d’email ' }}
    />
    <ProfileStack.Screen
      name="ChangeEmailSetPassword"
      component={withAuthProtection(ChangeEmailSetPassword)}
      options={{ title: 'Création du mot de passe' }}
    />
    <ProfileStack.Screen
      name="NewEmailSelection"
      component={withAuthProtection(NewEmailSelection)}
      options={{ title: 'Nouvelle adresse e-mail' }}
    />
    <ProfileStack.Screen
      name="FeedbackInApp"
      component={withAuthProtection(FeedbackInApp)}
      options={{ title: 'Formulaire de suggestion' }}
    />
    <ProfileStack.Screen
      name="DisplayPreference"
      component={DisplayPreference}
      options={{ title: 'Préférence d’affichage' }}
    />
    <ProfileStack.Screen
      name="ProfileTutorialAgeInformationCredit"
      component={ProfileTutorialAgeInformationCredit}
      options={{ title: 'Préférence d’affichage' }}
    />
  </ProfileStack.Navigator>
)
