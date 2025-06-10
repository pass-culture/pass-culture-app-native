import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationCulturalSurveyButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'CulturalSurvey 🎨',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationCulturalSurvey' },
    subscreens: [
      { screen: 'CulturalSurveyIntro' },
      { screen: 'CulturalSurveyQuestions' },
      { screen: 'CulturalSurveyThanks' },
    ],
  },
]

export function CheatcodesNavigationCulturalSurvey(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationCulturalSurveyButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationCulturalSurveyButtons} />
    </CheatcodesTemplateScreen>
  )
}
