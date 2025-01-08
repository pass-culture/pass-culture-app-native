import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationTutorialButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Tutorial ❔',
    screen: 'CheatcodesNavigationTutorial',
    subscreens: [
      { title: 'Onboarding  🛶', screen: 'CheatcodesNavigationOnboarding' },
      { title: 'ProfileTutorial 👤', screen: 'CheatcodesNavigationProfileTutorial' },
    ],
  },
]

export function CheatcodesNavigationTutorial(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationTutorialButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationTutorialButtons} />
    </CheatcodesTemplateScreen>
  )
}
