import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationGenericPagesButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Pages génériques 📄',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationGenericPages' },
    subscreens: [
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenPageWithHeader' },
        title: 'PageWithHeader',
      },
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenPageWithHeader' },
        title: 'PageWithHeader',
      },
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenGenericInfoPage' },
        title: 'GenericInfoPage',
      },
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenGenericErrorPage' },
        title: 'GenericErrorPage',
      },
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenGenericOfficialPage' },
        title: 'GenericOfficialPage',
      },
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenSecondaryPageWithBlurHeader' },
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
