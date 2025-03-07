import React from 'react'

import { ProfileStack } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { Accessibility } from 'features/profile/pages/Accessibility/Accessibility'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { AccessibilityDeclarationMobile } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobile'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { RecommendedPaths } from 'features/profile/pages/Accessibility/RecommendedPaths'
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
  </ProfileStack.Navigator>
)
