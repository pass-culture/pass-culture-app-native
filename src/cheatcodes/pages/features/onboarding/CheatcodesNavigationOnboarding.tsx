import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { getOnboardingNavConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingNavConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const onboardingCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Onboarding 🚸',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationOnboarding' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Onboarding: Non éligible',
      navigationTarget: getOnboardingNavConfig('OnboardingNotEligible'),
    },
    {
      id: uuidv4(),
      title: 'Onboarding: Bienvenue (grand public)',
      navigationTarget: getOnboardingNavConfig('OnboardingGeneralPublicWelcome'),
    },
    {
      id: uuidv4(),
      title: 'Onboarding: Bienvenue',
      navigationTarget: getOnboardingNavConfig('OnboardingWelcome'),
    },
    {
      id: uuidv4(),
      title: 'Onboarding: Géolocalisation',
      navigationTarget: getOnboardingNavConfig('OnboardingGeolocation'),
    },
    {
      id: uuidv4(),
      title: 'Onboarding: Choix de l’âge',
      navigationTarget: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
    },
    {
      id: uuidv4(),
      title: 'Onboarding: Info âge (17 ans)',
      navigationTarget: getOnboardingNavConfig('OnboardingAgeInformation', { age: 17 }),
    },
    {
      id: uuidv4(),
      title: 'Onboarding: Info âge (18 ans)',
      navigationTarget: getOnboardingNavConfig('OnboardingAgeInformation', { age: 18 }),
    },
  ],
}

export const cheatcodesNavigationOnboardingButtons: CheatcodeCategory[] = [
  onboardingCheatcodeCategory,
]

export function CheatcodesNavigationOnboarding(): React.JSX.Element {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )

  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={onboardingCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={onboardingCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
