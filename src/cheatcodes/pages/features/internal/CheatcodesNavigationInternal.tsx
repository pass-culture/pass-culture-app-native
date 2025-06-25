// cheatcodes/pages/features/internal/CheatcodesNavigationInternal.tsx (Refactored)

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
const internalCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Internal (Marketing) 🎯', // Corrected typo from Maketing -> Marketing
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationInternal' },
  },
  // The subscreens now have explicit, mandatory titles.
  subscreens: [
    {
      id: uuidv4(),
      title: 'Générateur de Deeplinks', // <-- Explicit title
      navigationTarget: { screen: 'DeeplinksGenerator' },
    },
    {
      id: uuidv4(),
      title: 'Paramètres UTM', // <-- Explicit title
      navigationTarget: { screen: 'UTMParameters' },
    },
  ],
}

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationInternalButtons: CheatcodeCategory[] = [internalCheatcodeCategory]

export function CheatcodesNavigationInternal(): React.JSX.Element {
  // --- NEW: Use the custom goBack hook for consistent navigation ---
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  return (
    // The title is from our clean object, and we pass the goBack handler
    <CheatcodesTemplateScreen title={internalCheatcodeCategory.title} onGoBack={goBack}>
      {/* 
        We pass the clean subscreens array directly. 
        It's in the perfect CheatcodeButton[] format.
      */}
      <CheatcodesSubscreensButtonList buttons={internalCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
