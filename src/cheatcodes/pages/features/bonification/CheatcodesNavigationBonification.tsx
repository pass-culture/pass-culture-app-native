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
      navigationTarget: { screen: 'BonificationExplanations' },
    },
    {
      id: uuidv4(),
      title: 'BonificationRequiredInformation - Family Quotient',
      navigationTarget: {
        screen: 'BonificationRequiredInformation',
        params: {
          bonificationType: BonificationType.FAMILY_QUOTIENT,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationRequiredInformation - Disability',
      navigationTarget: {
        screen: 'BonificationRequiredInformation',
        params: {
          bonificationType: BonificationType.DISABILITY,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationNames',
      navigationTarget: { screen: 'BonificationNames' },
    },
    {
      id: uuidv4(),
      title: 'BonificationTitle',
      navigationTarget: { screen: 'BonificationTitle' },
    },
    {
      id: uuidv4(),
      title: 'BonificationBirthDate',
      navigationTarget: { screen: 'BonificationBirthDate' },
    },
    {
      id: uuidv4(),
      title: 'BonificationBirthPlace - Family Quotient',
      navigationTarget: {
        screen: 'BonificationBirthPlace',
        params: {
          bonificationType: BonificationType.FAMILY_QUOTIENT,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationBirthPlace - Disability',
      navigationTarget: {
        screen: 'BonificationBirthPlace',
        params: {
          bonificationType: BonificationType.DISABILITY,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationRecap - Family Quotient',
      navigationTarget: {
        screen: 'BonificationRecap',
        params: {
          bonificationType: BonificationType.FAMILY_QUOTIENT,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationRecap - Disability',
      navigationTarget: {
        screen: 'BonificationRecap',
        params: {
          bonificationType: BonificationType.DISABILITY,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationError - Family Quotient',
      navigationTarget: {
        screen: 'BonificationError',
        params: {
          bonificationType: BonificationType.FAMILY_QUOTIENT,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationError - Disability',
      navigationTarget: {
        screen: 'BonificationError',
        params: {
          bonificationType: BonificationType.DISABILITY,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationGranted',
      navigationTarget: { screen: 'BonificationGranted' },
    },
    {
      id: uuidv4(),
      title: 'BonificationFamilyQuotientRefused CUSTODIAN_NOT_FOUND',
      navigationTarget: {
        screen: 'BonificationFamilyQuotientRefused',
        params: {
          bonificationRefusedType: BonificationQFRefusedType.CUSTODIAN_NOT_FOUND,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationFamilyQuotientRefused APPLICATION_NOT_FOUND',
      navigationTarget: {
        screen: 'BonificationFamilyQuotientRefused',
        params: {
          bonificationRefusedType: BonificationQFRefusedType.APPLICATION_NOT_FOUND,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationFamilyQuotientRefused NOT_IN_TAX_HOUSEHOLD',
      navigationTarget: {
        screen: 'BonificationFamilyQuotientRefused',
        params: {
          bonificationRefusedType: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationFamilyQuotientRefused QUOTIENT_FAMILY_TOO_HIGH',
      navigationTarget: {
        screen: 'BonificationFamilyQuotientRefused',
        params: {
          bonificationRefusedType: BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationFamilyQuotientRefused TOO_MANY_RETRIES',
      navigationTarget: {
        screen: 'BonificationFamilyQuotientRefused',
        params: {
          bonificationRefusedType: BonificationQFRefusedType.TOO_MANY_RETRIES,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationDisabilityRefused TOO_MANY_RETRIES',
      navigationTarget: {
        screen: 'BonificationDisabilityRefused',
        params: {
          bonificationRefusedType: BonificationDisabilityRefusedType.TOO_MANY_RETRIES,
        },
      },
    },
    {
      id: uuidv4(),
      title: 'BonificationDisabilityRefused APPLICATION_NOT_FOUND',
      navigationTarget: {
        screen: 'BonificationDisabilityRefused',
        params: {
          bonificationRefusedType: BonificationDisabilityRefusedType.APPLICATION_NOT_FOUND,
        },
      },
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
