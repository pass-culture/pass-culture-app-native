import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { Loader } from 'ui/components/Loader'
import { Button } from 'ui/designSystem/Button/Button'

export const CheatcodesScreenLoader = () => {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesNavigationGenericPages'))

  return (
    <CheatcodesTemplateScreen title="Loader" onGoBack={goBack} flexDirection="column">
      <Loader message="Chargement en cours..." />
      <Button fullWidth isLoading variant="secondary" wording="Chargement en cours..." />
    </CheatcodesTemplateScreen>
  )
}
