import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'

const culturalSurveyCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'CulturalSurvey 🎨',
  navigationTarget: {
    screen: 'CheatcodesNavigationCulturalSurvey',
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'CulturalSurveyIntro',
      navigationTarget: getSubscriptionPropConfig('CulturalSurveyIntro'),
    },
    {
      id: uuidv4(),
      title: 'CulturalSurveyQuestions',
      navigationTarget: getSubscriptionPropConfig('CulturalSurveyQuestions'),
    },
    {
      id: uuidv4(),
      title: 'CulturalSurveyThanks',
      navigationTarget: getSubscriptionPropConfig('CulturalSurveyThanks'),
    },
  ],
}

export const cheatcodesNavigationCulturalSurveyButtons: CheatcodeCategory[] = [
  culturalSurveyCheatcodeCategory,
]

export const CheatcodesNavigationCulturalSurvey = () => (
  <CheatcodesTemplateScreen title={culturalSurveyCheatcodeCategory.title}>
    <CheatcodesSubscreensButtonList buttons={culturalSurveyCheatcodeCategory.subscreens} />
  </CheatcodesTemplateScreen>
)
