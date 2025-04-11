import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreenWithNavigateTo } from 'cheatcodes/components/LinkToScreenWithNavigateTo'
import { getOnboardingNavConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingNavConfig'
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
      <LinkToScreenWithNavigateTo
        title="OnboardingNotEligible"
        navigateTo={getOnboardingNavConfig('OnboardingNotEligible')}
      />
      <LinkToScreenWithNavigateTo
        title="OnboardingGeneralPublicWelcome"
        navigateTo={getOnboardingNavConfig('OnboardingGeneralPublicWelcome')}
      />
      <LinkToScreenWithNavigateTo
        title="OnboardingWelcome"
        navigateTo={getOnboardingNavConfig('OnboardingWelcome')}
      />
      <LinkToScreenWithNavigateTo
        title="OnboardingGeolocation"
        navigateTo={getOnboardingNavConfig('OnboardingGeolocation')}
      />
      <LinkToScreenWithNavigateTo
        title="AgeSelectionFork"
        navigateTo={getOnboardingNavConfig('AgeSelectionFork', { type: TutorialTypes.ONBOARDING })}
      />
      <LinkToScreenWithNavigateTo
        title="AgeInfo - 17 ans"
        navigateTo={getOnboardingNavConfig('OnboardingAgeInformation', { age: 17 })}
      />
      <LinkToScreenWithNavigateTo
        title="AgeInfo - 18 ans"
        navigateTo={getOnboardingNavConfig('OnboardingAgeInformation', { age: 18 })}
      />
    </CheatcodesTemplateScreen>
  )
}
