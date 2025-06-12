import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { getOnboardingNavConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingNavConfig'

export const cheatcodesNavigationOnboardingButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Onboarding 🚸',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationOnboarding' },
    subscreens: [
      getOnboardingNavConfig('OnboardingNotEligible'),
      getOnboardingNavConfig('OnboardingGeneralPublicWelcome'),
      getOnboardingNavConfig('OnboardingWelcome'),
      getOnboardingNavConfig('OnboardingGeolocation'),
      getOnboardingNavConfig('OnboardingAgeSelectionFork'),
      getOnboardingNavConfig('OnboardingAgeInformation', { age: 17 }),
      getOnboardingNavConfig('OnboardingAgeInformation', { age: 18 }),
    ],
  },
]

export function CheatcodesNavigationOnboarding(): React.JSX.Element {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )

  return (
    <CheatcodesTemplateScreen title="Onboarding 🛶">
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationOnboardingButtons} />
    </CheatcodesTemplateScreen>
  )
}
