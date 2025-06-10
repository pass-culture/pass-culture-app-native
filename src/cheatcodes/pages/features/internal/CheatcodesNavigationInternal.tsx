import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationInternalButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Internal (Maketing) 🎯',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationInternal' },
    subscreens: [{ screen: 'DeeplinksGenerator' }, { screen: 'UTMParameters' }],
  },
]

export function CheatcodesNavigationInternal(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationInternalButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationInternalButtons} />
    </CheatcodesTemplateScreen>
  )
}
