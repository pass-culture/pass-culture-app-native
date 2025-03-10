import React from 'react'

import { ProfileStack } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { AccessibilityDeclarationMobile } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobile'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
import { ConfirmDeleteProfile } from 'features/profile/pages/DeleteProfile/ConfirmDeleteProfile'
import { DeleteProfileAccountHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountHacked'
import { DeleteProfileAccountNotDeletable } from 'features/profile/pages/DeleteProfile/DeleteProfileAccountNotDeletable'
import { DeleteProfileConfirmation } from 'features/profile/pages/DeleteProfile/DeleteProfileConfirmation'
import { DeleteProfileContactSupport } from 'features/profile/pages/DeleteProfile/DeleteProfileContactSupport'
import { DeleteProfileEmailHacked } from 'features/profile/pages/DeleteProfile/DeleteProfileEmailHacked'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfile/DeleteProfileSuccess'
import { DeleteProfileReason } from 'features/profile/pages/DeleteProfileReason/DeleteProfileReason'
import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { Profile } from 'features/profile/pages/Profile'

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
      component={DeleteProfileReason}
      options={{ title: 'Raison de suppression de compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileContactSupport"
      component={DeleteProfileContactSupport}
      options={{ title: 'Contact support' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileEmailHacked"
      component={DeleteProfileEmailHacked}
      options={{ title: 'Sécurise ton compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileAccountHacked"
      component={DeleteProfileAccountHacked}
      options={{ title: 'Sécurise ton compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileAccountNotDeletable"
      component={DeleteProfileAccountNotDeletable}
      options={{ title: 'Compte non supprimable' }}
    />
    <ProfileStack.Screen
      name="ConfirmDeleteProfile"
      component={ConfirmDeleteProfile}
      options={{ title: 'Suppression de compte' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileConfirmation"
      component={DeleteProfileConfirmation}
      options={{ title: 'Réglages de notifications' }}
    />
    <ProfileStack.Screen
      name="DeleteProfileSuccess"
      component={DeleteProfileSuccess}
      options={{ title: 'Suppression profil confirmée' }}
    />
  </ProfileStack.Navigator>
)
