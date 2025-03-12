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
import { ChangeCity } from 'features/profile/pages/ChangeCity/ChangeCity'
import { ChangeEmail } from 'features/profile/pages/ChangeEmail/ChangeEmail'
import { ChangeStatus } from 'features/profile/pages/ChangeStatus/ChangeStatus'
import { ConfirmDeleteProfile } from 'features/profile/pages/DeleteProfile/ConfirmDeleteProfile'
import { DeactivateProfileSuccess } from 'features/profile/pages/DeleteProfile/DeactivateProfileSuccess'
import { DeleteProfileAccountHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountHacked'
import { DeleteProfileAccountNotDeletable } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountNotDeletable'
import { DeleteProfileConfirmation } from 'features/profile/pages/DeleteProfile/DeleteProfileConfirmation'
import { DeleteProfileContactSupport } from 'features/profile/pages/DeleteProfile/DeleteProfileContactSupport'
import { DeleteProfileEmailHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileEmailHacked'
import { SuspendAccountConfirmationWithoutAuthentication } from 'features/profile/pages/DeleteProfile/SuspendAccountConfirmationWithoutAuthentication'
import { DeleteProfileReason } from 'features/profile/pages/DeleteProfileReason/DeleteProfileReason'
import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { Profile } from 'features/profile/pages/Profile'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'

export const ProfileStackNavigator = () => (
  <ProfileStack.Navigator initialRouteName="Profile" screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    <ProfileStack.Screen name="Profile" component={Profile} options={{ title: 'Mon profil' }} />
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
  </ProfileStack.Navigator>
)
