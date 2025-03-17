import React from 'react'

import { ActivationNavigatorBase } from 'features/navigation/ActivationStackNavigator/ActivationNavigatorBase'
import { AgeSelectionFork } from 'features/tutorial/pages/AgeSelectionFork'
import { AgeSelectionOther } from 'features/tutorial/pages/AgeSelectionOther'
import { EligibleUserAgeSelection } from 'features/tutorial/pages/EligibleUserAgeSelection'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
import { OnboardingGeneralPublicWelcome } from 'features/tutorial/pages/onboarding/OnboardingGeneralPublicWelcome'
import { OnboardingGeolocation } from 'features/tutorial/pages/onboarding/OnboardingGeolocation'
import { OnboardingNotEligible } from 'features/tutorial/pages/onboarding/OnboardingNotEligible'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'
import { ProfileTutorialAgeInformation } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformation'
import { ProfileTutorialAgeInformationCreditV3 } from 'features/tutorial/pages/profileTutorial/ProfileTutorialAgeInformationCreditV3'

export const ActivationStackNavigator = () => (
  <ActivationNavigatorBase.Navigator initialRouteName="AgeSelectionFork">
    <ActivationNavigatorBase.Screen
      name="AgeSelectionFork"
      component={AgeSelectionFork}
      options={{ title: 'Sélection d’âge' }}
    />
    <ActivationNavigatorBase.Screen
      name="EligibleUserAgeSelection"
      component={EligibleUserAgeSelection}
      options={{ title: 'Sélection d’âge éligible' }}
    />
    <ActivationNavigatorBase.Screen
      name="AgeSelectionOther"
      component={AgeSelectionOther}
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
      name="OnboardingWelcome"
      component={OnboardingWelcome}
      options={{ title: 'Bienvenue' }}
    />
    <ActivationNavigatorBase.Screen
      name="ProfileTutorialAgeInformation"
      component={ProfileTutorialAgeInformation}
      options={{ title: 'Information d’âge' }}
    />
    <ActivationNavigatorBase.Screen
      name="ProfileTutorialAgeInformationCreditV3"
      component={ProfileTutorialAgeInformationCreditV3}
      options={{ title: 'Information d’âge' }}
    />
  </ActivationNavigatorBase.Navigator>
)
