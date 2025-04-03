import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationGenericPagesButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Pages génériques 📄',
    screen: 'CheatcodesNavigationGenericPages',
    subscreens: [
      { screen: 'CheatcodesScreenPageWithHeader', title: 'PageWithHeader' },
      { screen: 'CheatcodesScreenGenericInfoPage', title: 'GenericInfoPage' },
      { screen: 'CheatcodesScreenGenericErrorPage', title: 'GenericErrorPage' },
      { screen: 'CheatcodesScreenGenericOfficialPage', title: 'GenericOfficialPage' },
      {
        screen: 'CheatcodesScreenSecondaryPageWithBlurHeader',
        title: 'SecondaryPageWithBlurHeader',
      },
    ],
  },
]

export function CheatcodesNavigationGenericPages(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationGenericPagesButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationGenericPagesButtons} />
    </CheatcodesTemplateScreen>
  )
}
