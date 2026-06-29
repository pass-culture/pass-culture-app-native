import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { BonificationType } from 'features/bonification/enums'
import {
  BonificationQFRefusedType,
  BonificationDisabilityRefusedType,
} from 'features/bonification/types/BonificationRefusedType'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const bonificationCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Bonification 💸',
  navigationTarget: {
    screen: 'CheatcodesNavigationBonification',
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'BonificationExplanations',
      navigationTarget: getSubscriptionPropConfig('BonificationExplanations'),
    },
    {
      id: uuidv4(),
      title: 'BonificationRequiredInformation - Family Quotient',
      navigationTarget: getSubscriptionPropConfig('BonificationRequiredInformation', {
        bonificationType: BonificationType.FAMILY_QUOTIENT,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRequiredInformation - Disability',
      navigationTarget: getSubscriptionPropConfig('BonificationRequiredInformation', {
        bonificationType: BonificationType.DISABILITY,
      }),
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
      title: 'BonificationBirthPlace - Family Quotient',
      navigationTarget: getSubscriptionPropConfig('BonificationBirthPlace', {
        bonificationType: BonificationType.FAMILY_QUOTIENT,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationBirthPlace - Disability',
      navigationTarget: getSubscriptionPropConfig('BonificationBirthPlace', {
        bonificationType: BonificationType.DISABILITY,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRecap - Family Quotient',
      navigationTarget: getSubscriptionPropConfig('BonificationRecap', {
        bonificationType: BonificationType.FAMILY_QUOTIENT,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRecap - Disability',
      navigationTarget: getSubscriptionPropConfig('BonificationRecap', {
        bonificationType: BonificationType.DISABILITY,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationError - Family Quotient',
      navigationTarget: getSubscriptionPropConfig('BonificationError', {
        bonificationType: BonificationType.FAMILY_QUOTIENT,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationError - Disability',
      navigationTarget: getSubscriptionPropConfig('BonificationError', {
        bonificationType: BonificationType.DISABILITY,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationIncorrectLink',
      navigationTarget: getSubscriptionPropConfig('BonificationIncorrectLink'),
    },
    {
      id: uuidv4(),
      title: 'BonificationGranted',
      navigationTarget: { screen: 'BonificationGranted' },
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused CUSTODIAN_NOT_FOUND',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationQFRefusedType.CUSTODIAN_NOT_FOUND,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused APPLICATION_NOT_FOUND',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationQFRefusedType.APPLICATION_NOT_FOUND,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused NOT_IN_TAX_HOUSEHOLD',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused QUOTIENT_FAMILY_TOO_HIGH',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationRefused TOO_MANY_RETRIES',
      navigationTarget: getSubscriptionPropConfig('BonificationRefused', {
        bonificationRefusedType: BonificationQFRefusedType.TOO_MANY_RETRIES,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationDisabilityRefused TOO_MANY_RETRIES',
      navigationTarget: getSubscriptionPropConfig('BonificationDisabilityRefused', {
        bonificationRefusedType: BonificationDisabilityRefusedType.TOO_MANY_RETRIES,
      }),
    },
    {
      id: uuidv4(),
      title: 'BonificationDisabilityRefused APPLICATION_NOT_FOUND',
      navigationTarget: getSubscriptionPropConfig('BonificationDisabilityRefused', {
        bonificationRefusedType: BonificationDisabilityRefusedType.APPLICATION_NOT_FOUND,
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
