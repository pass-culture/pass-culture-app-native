import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const internalCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Internal (Marketing) 🎯',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationInternal' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Générateur de Deeplinks',
      navigationTarget: { screen: 'DeeplinksGenerator' },
    },
    {
      id: uuidv4(),
      title: 'Paramètres UTM',
      navigationTarget: { screen: 'UTMParameters' },
    },
  ],
}

export const cheatcodesNavigationInternalButtons: CheatcodeCategory[] = [internalCheatcodeCategory]

export function CheatcodesNavigationInternal(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={internalCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={internalCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
