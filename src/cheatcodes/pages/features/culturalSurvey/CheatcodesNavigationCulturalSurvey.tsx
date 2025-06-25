// cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
// --- Import the custom navigation hooks ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'

// --- We define a single, well-typed category object ---
export const culturalSurveyCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'CulturalSurvey 🎨',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationCulturalSurvey' },
  },
  // The subscreens now have explicit, mandatory titles.
  subscreens: [
    {
      id: uuidv4(),
      title: 'Introduction au questionnaire', // <-- Explicit title
      navigationTarget: { screen: 'CulturalSurveyIntro' },
    },
    {
      id: uuidv4(),
      title: 'Questions du questionnaire', // <-- Explicit title
      navigationTarget: { screen: 'CulturalSurveyQuestions' },
    },
    {
      id: uuidv4(),
      title: 'Page de remerciement', // <-- Explicit title
      navigationTarget: { screen: 'CulturalSurveyThanks' },
    },
  ],
}

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationCulturalSurveyButtons: CheatcodeCategory[] = [
  culturalSurveyCheatcodeCategory,
]

export function CheatcodesNavigationCulturalSurvey(): React.JSX.Element {
  // --- NEW: Use the custom goBack hook for consistent navigation ---
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    // The title is sourced from our clean object, and we pass the goBack handler
    <CheatcodesTemplateScreen title={culturalSurveyCheatcodeCategory.title} onGoBack={goBack}>
      {/* 
        We pass the clean subscreens array directly. 
        It's in the perfect CheatcodeButton[] format for the list component.
      */}
      <CheatcodesSubscreensButtonList buttons={culturalSurveyCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
