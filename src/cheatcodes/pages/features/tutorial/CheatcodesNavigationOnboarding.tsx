import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
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
      <LinkToComponent name="OnboardingGeneralPublicWelcome" />
      <LinkToComponent name="OnboardingWelcome" />
      <LinkToComponent name="OnboardingGeolocation" />
      <LinkToComponent
        name="AgeSelectionFork"
        navigationParams={{ type: TutorialTypes.ONBOARDING }}
      />
      <LinkToComponent
        name="EligibleUserAgeSelection"
        navigationParams={{ type: TutorialTypes.ONBOARDING }}
      />
      <LinkToComponent
        name="AgeSelectionOther"
        navigationParams={{ type: TutorialTypes.ONBOARDING }}
      />
      <LinkToComponent
        name="OnboardingAgeInformation"
        title="AgeInfo - 15 ans"
        navigationParams={{ age: 15 }}
      />
      <LinkToComponent
        name="OnboardingAgeInformation"
        title="AgeInfo - 16 ans"
        navigationParams={{ age: 16 }}
      />
      <LinkToComponent
        name="OnboardingAgeInformation"
        title="AgeInfo - 17 ans"
        navigationParams={{ age: 17 }}
      />
      <LinkToComponent
        name="OnboardingAgeInformation"
        title="AgeInfo - 18 ans"
        navigationParams={{ age: 18 }}
      />
    </CheatcodesTemplateScreen>
  )
}
