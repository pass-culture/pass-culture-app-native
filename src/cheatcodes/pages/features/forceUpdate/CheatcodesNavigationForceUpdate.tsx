import React, { FC, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { ForceUpdateWithResetErrorBoundary } from 'features/forceUpdate/pages/ForceUpdateWithResetErrorBoundary'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

const forceUpdateCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'ForceUpdate 🆙',
  navigationTarget: {
    screen: 'CheatcodesNavigationForceUpdate',
  },
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

export const CheatcodesNavigationForceUpdate: FC = () => {
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

  const visibleSubscreens = forceUpdateCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={forceUpdateCheatcodeCategory.title}>
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
