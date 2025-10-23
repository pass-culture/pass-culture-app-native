import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const bonificationCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Bonification 💸',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationBonification' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'BonificationIntroduction',
      navigationTarget: getSubscriptionPropConfig('BonificationIntroduction'),
    },
    {
      id: uuidv4(),
      title: 'BonificationNames',
      navigationTarget: getSubscriptionPropConfig('BonificationNames'),
    },
    {
      id: uuidv4(),
      title: 'BonificationTitle',
      navigationTarget: getSubscriptionPropConfig('BonificationTitle'),
    },
    {
      id: uuidv4(),
      title: 'BonificationBirthDate',
      navigationTarget: getSubscriptionPropConfig('BonificationBirthDate'),
    },
    {
      id: uuidv4(),
      title: 'BonificationBirthPlace',
      navigationTarget: getSubscriptionPropConfig('BonificationBirthPlace'),
    },
    {
      id: uuidv4(),
      title: 'BonificationRecap',
      navigationTarget: getSubscriptionPropConfig('BonificationRecap'),
    },
    {
      id: uuidv4(),
      title: 'BonificationError',
      navigationTarget: getSubscriptionPropConfig('BonificationError'),
    },
    {
      id: uuidv4(),
      title: 'BonificationGranted',
      navigationTarget: getSubscriptionPropConfig('BonificationGranted'),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused'),
    },
  ],
}

export const cheatcodesNavigationBonificationButtons: CheatcodeCategory[] = [
  bonificationCheatcodeCategory,
]

export function CheatcodesNavigationBonification(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  const visibleSubscreens = bonificationCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={bonificationCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />
    </CheatcodesTemplateScreen>
  )
}
