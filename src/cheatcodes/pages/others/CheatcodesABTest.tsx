import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'

export function CheatcodesScreenABTest(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  return (
    <CheatcodesTemplateScreen
      title="Cheatcodes AB Test"
      onGoBack={goBack}></CheatcodesTemplateScreen>
  )
}
