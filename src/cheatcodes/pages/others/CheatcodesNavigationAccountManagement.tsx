import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { useGoBack } from 'features/navigation/useGoBack'

const accountManagementCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Account Management ⚙️',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationAccountManagement' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'FraudulentSuspendedAccount',
      navigationTarget: { screen: 'FraudulentSuspendedAccount' },
    },
    {
      id: uuidv4(),
      title: 'SuspendedAccountUponUserRequest',
      navigationTarget: { screen: 'SuspendedAccountUponUserRequest' },
    },
    {
      id: uuidv4(),
      title: 'AccountReactivationSuccess',
      navigationTarget: { screen: 'AccountReactivationSuccess' },
    },
    {
      id: uuidv4(),
      title: 'ResetPasswordExpiredLink',
      navigationTarget: { screen: 'ResetPasswordExpiredLink' },
    },
    {
      id: uuidv4(),
      title: 'ResetPasswordEmailSent (email: jean.dupont@gmail.com)',
      navigationTarget: {
        screen: 'ResetPasswordEmailSent',
        params: { email: 'jean.dupont@gmail.com' },
      },
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileReason',
      navigationTarget: getProfilePropConfig('DeleteProfileReason'),
    },
    {
      id: uuidv4(),
      title: 'DebugScreen',
      navigationTarget: getProfilePropConfig('DebugScreen'),
    },
    {
      id: uuidv4(),
      title: 'ConfirmDeleteProfile',
      navigationTarget: getProfilePropConfig('ConfirmDeleteProfile'),
    },
    {
      id: uuidv4(),
      title: 'DeactivateProfileSuccess',
      navigationTarget: getProfilePropConfig('DeactivateProfileSuccess'),
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileSuccess',
      navigationTarget: getProfilePropConfig('DeleteProfileSuccess'),
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileConfirmation',
      navigationTarget: getProfilePropConfig('DeleteProfileConfirmation'),
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileAccountNotDeletable',
      navigationTarget: getProfilePropConfig('DeleteProfileAccountNotDeletable'),
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileAccountHacked',
      navigationTarget: getProfilePropConfig('DeleteProfileAccountHacked'),
    },
  ],
}

export const cheatcodesNavigationAccountManagementButtons: CheatcodeCategory[] = [
  accountManagementCheatcodeCategory,
]

export function CheatcodesNavigationAccountManagement(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  return (
    <CheatcodesTemplateScreen title={accountManagementCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={accountManagementCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
