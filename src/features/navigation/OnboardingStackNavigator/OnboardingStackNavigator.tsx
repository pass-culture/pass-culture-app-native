import React from 'react'

import { OnboardingNavigatorBase } from 'features/navigation/OnboardingStackNavigator/OnboardingNavigatorBase'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { AgeSelectionFork } from 'features/tutorial/pages/onboarding/AgeSelectionFork'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { OnboardingGeneralPublicWelcome } from 'features/tutorial/pages/onboarding/OnboardingGeneralPublicWelcome'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { OnboardingNotEligible } from 'features/tutorial/pages/onboarding/OnboardingNotEligible'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'
import { ProfileTutorialAgeInformationCredit } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformationCredit'

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
      name="AgeSelectionFork"
      component={AgeSelectionFork}
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
    <OnboardingNavigatorBase.Screen
      name="ProfileTutorialAgeInformationCredit"
      component={ProfileTutorialAgeInformationCredit}
      options={{ title: 'Information d’âge' }}
    />
  </OnboardingNavigatorBase.Navigator>
)
