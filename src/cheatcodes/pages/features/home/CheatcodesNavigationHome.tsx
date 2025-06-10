import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationHomeButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Home 🏠',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationHome' },
    subscreens: [
      {
        title: 'HighlightThematicHomeHeader',
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenHighlightThematicHomeHeader' },
      },
      {
        title: 'DefaultThematicHomeHeader',
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenDefaultThematicHomeHeader' },
      },
      {
        title: 'CategoryThematicHomeHeader',
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenCategoryThematicHomeHeader' },
      },
    ],
  },
]

export const CheatcodesNavigationHome = () => {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationHomeButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationHomeButtons} />
    </CheatcodesTemplateScreen>
  )
}
