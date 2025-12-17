import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { BonificationRefusedType } from 'features/bonification/pages/BonificationRefused'
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
      title: 'BonificationExplanations',
      navigationTarget: getSubscriptionPropConfig('BonificationExplanations'),
    },
    {
      id: uuidv4(),
      title: 'BonificationRequiredInformation',
      navigationTarget: getSubscriptionPropConfig('BonificationRequiredInformation'),
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
      navigationTarget: { screen: 'BonificationGranted' },
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused PARENT_NOT_FOUND',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationRefusedType.PARENT_NOT_FOUND,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused CHILD_NOT_FOUND_FOR_PARENT',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationRefusedType.CHILD_NOT_FOUND_FOR_PARENT,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused FAMILY_QUOTIENT_TOO_HIGH',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationRefusedType.FAMILY_QUOTIENT_TOO_HIGH,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused TOO_MANY_RETRIES',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES,
      }),
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
