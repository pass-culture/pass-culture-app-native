// cheatcodes/pages/features/onboarding/CheatcodesNavigationOnboarding.tsx (Refactored)

import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
// --- Import the custom navigation hooks ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { getOnboardingNavConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingNavConfig'
import { useGoBack } from 'features/navigation/useGoBack'

// --- We define a single, well-typed category object ---
const onboardingCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Onboarding 🚸',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationOnboarding' },
  },
  subscreens: [
    // --- Direct integration of getOnboardingNavConfig with hardcoded titles ---
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

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationOnboardingButtons: CheatcodeCategory[] = [
  onboardingCheatcodeCategory,
]

export function CheatcodesNavigationOnboarding(): React.JSX.Element {
  // --- PRESERVED: This effect is specific to this screen's behavior ---
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )

  // --- NEW: Use the custom goBack hook for consistent navigation ---
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    // The title is now sourced from our clean object, ensuring consistency
    <CheatcodesTemplateScreen title={onboardingCheatcodeCategory.title} onGoBack={goBack}>
      {/* We pass the clean subscreens array directly. */}
      <CheatcodesSubscreensButtonList buttons={onboardingCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
