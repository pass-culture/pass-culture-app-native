import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { ButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationInternalButtons: [ButtonsWithSubscreensProps] = [
  {
    title: 'Internal (Maketing) 🎯',
    screen: 'CheatcodesNavigationInternal',
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
