import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const homeCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Home 🏠',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationHome' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'HighlightThematicHomeHeader',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenHighlightThematicHomeHeader' },
      },
    },
    {
      id: uuidv4(),
      title: 'DefaultThematicHomeHeader',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenDefaultThematicHomeHeader' },
      },
    },
    {
      id: uuidv4(),
      title: 'CategoryThematicHomeHeader',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenCategoryThematicHomeHeader' },
      },
    },
  ],
}

export const cheatcodesNavigationHomeButtons: CheatcodeCategory[] = [homeCheatcodeCategory]

export function CheatcodesNavigationHome(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={homeCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={homeCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
