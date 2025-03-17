import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreenWithNavigateTo } from 'cheatcodes/components/LinkToScreenWithNavigateTo'
import { getActivationNavConfig } from 'features/navigation/ActivationStackNavigator/getActivationNavConfig'
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
        navigateTo={{
          screen: 'ActivationStackNavigator',
          params: { screen: 'OnboardingNotEligible', params: { type: TutorialTypes.ONBOARDING } },
        }}
      />
      <LinkToScreenWithNavigateTo
        title="OnboardingGeneralPublicWelcome"
        navigateTo={getActivationNavConfig('OnboardingGeneralPublicWelcome')}
      />
      <LinkToScreenWithNavigateTo
        title="OnboardingWelcome"
        navigateTo={getActivationNavConfig('OnboardingWelcome')}
      />
      <LinkToScreenWithNavigateTo
        title="OnboardingGeolocation"
        navigateTo={getActivationNavConfig('OnboardingGeolocation')}
      />
      <LinkToScreenWithNavigateTo
        title="AgeSelectionFork"
        navigateTo={getActivationNavConfig('AgeSelectionFork', { type: TutorialTypes.ONBOARDING })}
      />
      <LinkToScreenWithNavigateTo
        title="AgeInfo - 17 ans"
        navigateTo={getActivationNavConfig('OnboardingAgeInformation', { age: 17 })}
      />
      <LinkToScreenWithNavigateTo
        title="AgeInfo - 18 ans"
        navigateTo={getActivationNavConfig('OnboardingAgeInformation', { age: 18 })}
      />
    </CheatcodesTemplateScreen>
  )
}
