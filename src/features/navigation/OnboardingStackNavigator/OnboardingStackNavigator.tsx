import React from 'react'

import { OnboardingNavigatorBase } from 'features/navigation/OnboardingStackNavigator/OnboardingNavigatorBase'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { OnboardingAgeInformation } from 'features/onboarding/pages/onboarding/OnboardingAgeInformation'
import { OnboardingAgeSelectionFork } from 'features/onboarding/pages/onboarding/OnboardingAgeSelectionFork'
import { OnboardingGeneralPublicWelcome } from 'features/onboarding/pages/onboarding/OnboardingGeneralPublicWelcome'
import { OnboardingGeolocation } from 'features/onboarding/pages/onboarding/OnboardingGeolocation'
import { OnboardingNotEligible } from 'features/onboarding/pages/onboarding/OnboardingNotEligible'
import { OnboardingWelcome } from 'features/onboarding/pages/onboarding/OnboardingWelcome'

export const OnboardingStackNavigator = () => (
  <OnboardingNavigatorBase.Navigator
    initialRouteName="OnboardingWelcome" // This will be used when getInitialScreen resolves to OnboardingStackNavigator
    screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    <OnboardingNavigatorBase.Screen
      name="OnboardingWelcome"
      component={OnboardingWelcome}
      options={{ title: 'Bienvenue' }}
    />
    <OnboardingNavigatorBase.Screen
      name="OnboardingAgeSelectionFork"
      component={OnboardingAgeSelectionFork}
      options={{ title: 'Sélection d’âge' }}
    />
    <OnboardingNavigatorBase.Screen
      name="OnboardingAgeInformation"
      component={OnboardingAgeInformation}
      options={{ title: 'Information d’âge' }}
    />
    <OnboardingNavigatorBase.Screen
      name="OnboardingGeolocation"
      component={OnboardingGeolocation}
      options={{ title: 'Active ta géolocalisation' }}
    />
    <OnboardingNavigatorBase.Screen
      name="OnboardingGeneralPublicWelcome"
      component={OnboardingGeneralPublicWelcome}
      options={{ title: 'Bienvenue' }}
    />
    <OnboardingNavigatorBase.Screen
      name="OnboardingNotEligible"
      component={OnboardingNotEligible}
      options={{ title: 'Encore un peu de patience' }}
    />
  </OnboardingNavigatorBase.Navigator>
)
