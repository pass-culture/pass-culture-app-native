import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const modalsCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Modals',
  navigationTarget: {
    screen: 'CheatcodesNavigationModals',
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Detailed',
      navigationTarget: {
        screen: 'CheatcodesScreenModalDetailed',
      },
    },
    {
      id: uuidv4(),
      title: 'Simple not scrollable',
      navigationTarget: {
        screen: 'CheatcodesScreenModalSimpleNotScrollable',
      },
    },
    {
      id: uuidv4(),
      title: 'Simple scrollable',
      navigationTarget: {
        screen: 'CheatcodesScreenModalSimpleScrollable',
      },
    },
  ],
}

export const cheatcodesNavigationModals: CheatcodeCategory[] = [modalsCheatcodeCategory]

export function CheatcodesNavigationModals(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={modalsCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={modalsCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
