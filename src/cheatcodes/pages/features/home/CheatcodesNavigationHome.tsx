// cheatcodes/pages/features/home/CheatcodesNavigationHome.tsx (Refactored)

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
const homeCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Home 🏠',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationHome' },
  },
  // The subscreens are now all valid CheatcodeButtons.
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

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationHomeButtons: CheatcodeCategory[] = [homeCheatcodeCategory]

export function CheatcodesNavigationHome(): React.JSX.Element {
  // --- NEW: Use the custom goBack hook for consistent navigation ---
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    // The title is from our clean object, and we pass the goBack handler
    <CheatcodesTemplateScreen title={homeCheatcodeCategory.title} onGoBack={goBack}>
      {/* 
        We pass the clean subscreens array directly. 
        It's in the perfect CheatcodeButton[] format.
      */}
      <CheatcodesSubscreensButtonList buttons={homeCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
