import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
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

export function CheatcodesNavigationCulturalSurvey(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={culturalSurveyCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={culturalSurveyCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
