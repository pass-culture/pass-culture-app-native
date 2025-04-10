import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { TutorialTypes } from 'features/tutorial/enums'

export function CheatcodesNavigationOnboarding(): React.JSX.Element {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )

  return (
    <CheatcodesTemplateScreen title="Onboarding 🛶">
      <LinkToScreen screen="OnboardingNotEligible" />
      <LinkToScreen screen="OnboardingGeneralPublicWelcome" />
      <LinkToScreen screen="OnboardingWelcome" />
      <LinkToScreen screen="OnboardingGeolocation" />
      <LinkToScreen
        screen="AgeSelectionFork"
        navigationParams={{ type: TutorialTypes.ONBOARDING }}
      />
      <LinkToScreen
        screen="OnboardingAgeInformation"
        title="AgeInfo - 17 ans"
        navigationParams={{ age: 17 }}
      />
      <LinkToScreen
        screen="OnboardingAgeInformation"
        title="AgeInfo - 18 ans"
        navigationParams={{ age: 18 }}
      />
    </CheatcodesTemplateScreen>
  )
}
