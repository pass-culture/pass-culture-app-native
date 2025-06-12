import React, { useState } from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { ForceUpdateWithResetErrorBoundary } from 'features/forceUpdate/pages/ForceUpdateWithResetErrorBoundary'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

export const cheatcodesNavigationForceUpdateButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'ForceUpdate 🆙',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationForceUpdate' },
    subscreens: [{ title: 'ForceUpdateWithResetErrorBoundary', showOnlyInSearch: true }],
  },
]

export function CheatcodesNavigationForceUpdate(): React.JSX.Element {
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

  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationForceUpdateButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationForceUpdateButtons} />
      <LinkToCheatcodesScreen
        title="ForceUpdateWithResetErrorBoundary"
        onPress={onPressForceUpdate}
      />
    </CheatcodesTemplateScreen>
  )
}
