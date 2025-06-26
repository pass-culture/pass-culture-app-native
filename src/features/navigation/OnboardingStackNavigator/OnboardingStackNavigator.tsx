import { StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'

import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { OnboardingStackNavigatorBase } from 'features/navigation/OnboardingStackNavigator/OnboardingStackNavigatorBase'
import { OnboardingStackRouteName } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { OnboardingAgeInformation } from 'features/onboarding/pages/onboarding/OnboardingAgeInformation'
import { OnboardingAgeSelectionFork } from 'features/onboarding/pages/onboarding/OnboardingAgeSelectionFork'
import { OnboardingGeneralPublicWelcome } from 'features/onboarding/pages/onboarding/OnboardingGeneralPublicWelcome'
import { OnboardingGeolocation } from 'features/onboarding/pages/onboarding/OnboardingGeolocation'
import { OnboardingNotEligible } from 'features/onboarding/pages/onboarding/OnboardingNotEligible'
import { OnboardingWelcome } from 'features/onboarding/pages/onboarding/OnboardingWelcome'

type OnboardingRouteConfig = {
  name: OnboardingStackRouteName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  options: StackNavigationOptions
}

const onboardingScreens: OnboardingRouteConfig[] = [
  {
    name: 'OnboardingWelcome',
    component: OnboardingWelcome,
    options: { title: 'Bienvenue' },
  },
  {
    name: 'OnboardingAgeSelectionFork',
    component: OnboardingAgeSelectionFork,
    options: { title: 'Sélection d’âge' },
  },
  {
    name: 'OnboardingAgeInformation',
    component: OnboardingAgeInformation,
    options: { title: 'Information d’âge' },
  },
  {
    name: 'OnboardingGeolocation',
    component: OnboardingGeolocation,
    options: { title: 'Active ta géolocalisation' },
  },
  {
    name: 'OnboardingGeneralPublicWelcome',
    component: OnboardingGeneralPublicWelcome,
    options: { title: 'Bienvenue' },
  },
  {
    name: 'OnboardingNotEligible',
    component: OnboardingNotEligible,
    options: { title: 'Encore un peu de patience' },
  },
]

export const OnboardingStackNavigator = () => (
  <OnboardingStackNavigatorBase.Navigator
    initialRouteName="OnboardingWelcome"
    screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    {onboardingScreens.map(({ name, component, options }) => (
      <OnboardingStackNavigatorBase.Screen
        key={name}
        name={name}
        component={withAsyncErrorBoundary(component)}
        options={options}
      />
    ))}
  </OnboardingStackNavigatorBase.Navigator>
)
