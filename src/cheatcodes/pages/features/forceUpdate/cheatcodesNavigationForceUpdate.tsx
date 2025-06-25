// cheatcodes/pages/features/forceUpdate/cheatcodesNavigationForceUpdate.tsx (Refactored)

import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
import { ForceUpdateWithResetErrorBoundary } from 'features/forceUpdate/pages/ForceUpdateWithResetErrorBoundary'
// --- Import the custom navigation hooks ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

// --- We define a single, well-typed category object ---
const forceUpdateCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'ForceUpdate 🆙',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationForceUpdate' },
  },
  // This subscreen exists only for search discovery.
  subscreens: [
    {
      id: uuidv4(),
      title: 'ForceUpdateWithResetErrorBoundary',
      showOnlyInSearch: true,
    },
  ],
}

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationForceUpdateButtons: CheatcodeCategory[] = [
  forceUpdateCheatcodeCategory,
]

export function CheatcodesNavigationForceUpdate(): React.JSX.Element {
  // --- NEW: Use the custom goBack hook for consistent navigation ---
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const { logType } = useLogTypeFromRemoteConfig()
  const onPressForceUpdate = () => {
    setScreenError(
      new ScreenError('Test force update page', {
        Screen: ForceUpdateWithResetErrorBoundary,
        logType,
      })
    )
  }

  if (screenError) throw screenError

  // Since all subscreens are showOnlyInSearch, this will be an empty array, which is correct.
  const visibleSubscreens = forceUpdateCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    // The title is from our clean object, and we pass the goBack handler
    <CheatcodesTemplateScreen title={forceUpdateCheatcodeCategory.title} onGoBack={goBack}>
      {/* This will render nothing, which is correct. */}
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      {/* --- REFACTORED: Use the new LinkToCheatcodesScreen API --- */}
      {/* We create a CheatcodeButton object on the fly for this manual action. */}
      <LinkToCheatcodesScreen
        key="force-update-button"
        button={{
          id: 'force-update-action',
          title: 'ForceUpdateWithResetErrorBoundary',
          onPress: onPressForceUpdate,
        }}
        variant="secondary"
      />
    </CheatcodesTemplateScreen>
  )
}
