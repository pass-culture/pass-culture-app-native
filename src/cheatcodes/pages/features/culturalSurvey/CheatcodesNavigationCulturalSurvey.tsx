// cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const culturalSurveyCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'CulturalSurvey 🎨',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationCulturalSurvey' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Introduction au questionnaire',
      navigationTarget: { screen: 'CulturalSurveyIntro' },
    },
    {
      id: uuidv4(),
      title: 'Questions du questionnaire',
      navigationTarget: { screen: 'CulturalSurveyQuestions' },
    },
    {
      id: uuidv4(),
      title: 'Page de remerciement',
      navigationTarget: { screen: 'CulturalSurveyThanks' },
    },
  ],
}

export const cheatcodesNavigationCulturalSurveyButtons: CheatcodeCategory[] = [
  culturalSurveyCheatcodeCategory,
]

export function CheatcodesNavigationCulturalSurvey(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={culturalSurveyCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={culturalSurveyCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
