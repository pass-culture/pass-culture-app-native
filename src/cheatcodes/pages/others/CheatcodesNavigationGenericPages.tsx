import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationGenericPagesButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'GenericPages 📄',
    screen: 'CheatcodesNavigationGenericPages',
    subscreens: [{ screen: 'CheatcodesScreenGenericInfoPageWhite' }],
  },
]

export function CheatcodesNavigationGenericPages(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationGenericPagesButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationGenericPagesButtons} />
    </CheatcodesTemplateScreen>
  )
}
