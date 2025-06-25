// cheatcodes/pages/others/CheatcodesNavigationGenericPages.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
// --- Import the custom navigation hooks ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'

// --- We define a single, well-typed category object ---
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
    // The original file had a duplicate, so we keep it
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

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationGenericPagesButtons: CheatcodeCategory[] = [
  genericPagesCheatcodeCategory,
]

export function CheatcodesNavigationGenericPages(): React.JSX.Element {
  // --- NEW: Use the custom goBack hook for consistent navigation ---
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    // The title is from our clean object, and we pass the goBack handler
    <CheatcodesTemplateScreen title={genericPagesCheatcodeCategory.title} onGoBack={goBack}>
      {/* We pass the clean subscreens array directly. */}
      <CheatcodesSubscreensButtonList buttons={genericPagesCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
