import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const genericPagesCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Pages génériques 📄',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationGenericPages' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'PageWithHeader',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenPageWithHeader' },
      },
    },
    {
      id: uuidv4(),
      title: 'PageWithHeader (duplicate)',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenPageWithHeader' },
      },
    },
    {
      id: uuidv4(),
      title: 'GenericInfoPage',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenGenericInfoPage' },
      },
    },
    {
      id: uuidv4(),
      title: 'GenericErrorPage',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenGenericErrorPage' },
      },
    },
    {
      id: uuidv4(),
      title: 'GenericOfficialPage',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenGenericOfficialPage' },
      },
    },
    {
      id: uuidv4(),
      title: 'SecondaryPageWithBlurHeader',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenSecondaryPageWithBlurHeader' },
      },
    },
  ],
}

export const cheatcodesNavigationGenericPagesButtons: CheatcodeCategory[] = [
  genericPagesCheatcodeCategory,
]

export function CheatcodesNavigationGenericPages(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={genericPagesCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={genericPagesCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
