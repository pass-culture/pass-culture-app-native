import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { getOnboardingPropConfig } from 'features/navigation/navigators/OnboardingStackNavigator/getOnboardingPropConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const onboardingCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Onboarding 🚸 (mobile only)',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationOnboarding' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'OnboardingNotEligible',
      navigationTarget: getOnboardingPropConfig('OnboardingNotEligible'),
    },
    {
      id: uuidv4(),
      title: 'OnboardingGeneralPublicWelcome',
      navigationTarget: getOnboardingPropConfig('OnboardingGeneralPublicWelcome'),
    },
    {
      id: uuidv4(),
      title: 'OnboardingWelcome',
      navigationTarget: getOnboardingPropConfig('OnboardingWelcome'),
    },
    {
      id: uuidv4(),
      title: 'OnboardingGeolocation',
      navigationTarget: getOnboardingPropConfig('OnboardingGeolocation'),
    },
    {
      id: uuidv4(),
      title: 'OnboardingAgeSelectionFork',
      navigationTarget: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
    },
    {
      id: uuidv4(),
      title: 'OnboardingAgeInformation (age: 17)',
      navigationTarget: getOnboardingPropConfig('OnboardingAgeInformation', { age: 17 }),
    },
    {
      id: uuidv4(),
      title: 'OnboardingAgeInformation (age: 18)',
      navigationTarget: getOnboardingPropConfig('OnboardingAgeInformation', { age: 18 }),
    },
  ],
}

export const cheatcodesNavigationOnboardingButtons: CheatcodeCategory[] = [
  onboardingCheatcodeCategory,
]

export function CheatcodesNavigationOnboarding(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={onboardingCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={onboardingCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
