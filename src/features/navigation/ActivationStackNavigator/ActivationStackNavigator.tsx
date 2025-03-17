import React from 'react'

import { ActivationNavigatorBase } from 'features/navigation/ActivationStackNavigator/ActivationNavigatorBase'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { TutorialTypes } from 'features/tutorial/enums'
import { AgeSelectionFork } from 'features/tutorial/pages/onboarding/AgeSelectionFork'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { OnboardingGeneralPublicWelcome } from 'features/tutorial/pages/onboarding/OnboardingGeneralPublicWelcome'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { OnboardingNotEligible } from 'features/tutorial/pages/onboarding/OnboardingNotEligible'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'
import { ProfileTutorialAgeInformationCredit } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformationCredit'

export const ActivationStackNavigator = () => (
  <ActivationNavigatorBase.Navigator
    initialRouteName="OnboardingWelcome"
    screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    <ActivationNavigatorBase.Screen
      name="OnboardingWelcome"
      component={OnboardingWelcome}
      options={{ title: 'Bienvenue' }}
      initialParams={{ type: TutorialTypes.ONBOARDING }} // This will be used when getInitialScreen resolves to ActivationStackNavigator
    />
    <ActivationNavigatorBase.Screen
      name="AgeSelectionFork"
      component={AgeSelectionFork}
      options={{ title: 'Sélection d’âge' }}
    />
    <ActivationNavigatorBase.Screen
      name="OnboardingAgeInformation"
      component={OnboardingAgeInformation}
      options={{ title: 'Information d’âge' }}
    />
    <ActivationNavigatorBase.Screen
      name="OnboardingGeolocation"
      component={OnboardingGeolocation}
      options={{ title: 'Active ta géolocalisation' }}
    />
    <ActivationNavigatorBase.Screen
      name="OnboardingGeneralPublicWelcome"
      component={OnboardingGeneralPublicWelcome}
      options={{ title: 'Bienvenue' }}
    />
    <ActivationNavigatorBase.Screen
      name="OnboardingNotEligible"
      component={OnboardingNotEligible}
      options={{ title: 'Encore un peu de patience' }}
    />
    <ActivationNavigatorBase.Screen
      name="ProfileTutorialAgeInformationCredit"
      component={ProfileTutorialAgeInformationCredit}
      options={{ title: 'Information d’âge' }}
    />
  </ActivationNavigatorBase.Navigator>
)
