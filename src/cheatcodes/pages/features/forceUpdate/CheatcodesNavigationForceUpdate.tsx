import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { ForceUpdateWithResetErrorBoundary } from 'features/forceUpdate/pages/ForceUpdateWithResetErrorBoundary'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

const forceUpdateCheatcodeCategory: CheatcodeCategoryo = {
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

export const cheatcodesNavigationForceUpdateButtons: CheatcodeCategory[] = [
  forceUpdateCheatcodeCategory,
]

export function CheatcodesNavigationForceUpdate(): React.JSX.Element {
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
    <CheatcodesTemplateScreen title={forceUpdateCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

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
