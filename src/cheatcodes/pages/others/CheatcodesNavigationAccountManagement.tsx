import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'

export const cheatcodesNavigationAccountManagementButtons: [CheatcodesButtonsWithSubscreensProps] =
  [
    {
      title: 'Account Management ⚙️',
      screen: 'CheatcodesStackNavigator',
      navigationParams: { screen: 'CheatcodesNavigationAccountManagement' },
      subscreens: [
        { screen: 'FraudulentSuspendedAccount' },
        { screen: 'SuspendedAccountUponUserRequest' },
        { screen: 'AccountReactivationSuccess' },
        { screen: 'ResetPasswordExpiredLink' },
        { screen: 'ResetPasswordEmailSent', navigationParams: { email: 'jean.dupont@gmail.com' } },
        getProfileNavConfig('DeleteProfileReason'),
        getProfileNavConfig('DebugScreen'),
        getProfileNavConfig('ConfirmDeleteProfile'),
        getProfileNavConfig('DeactivateProfileSuccess'),
        getProfileNavConfig('DeleteProfileSuccess'),
        getProfileNavConfig('DeleteProfileConfirmation'),
        getProfileNavConfig('DeleteProfileAccountNotDeletable'),
        getProfileNavConfig('DeleteProfileAccountHacked'),
      ],
    },
  ]

export function CheatcodesNavigationAccountManagement(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationAccountManagementButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationAccountManagementButtons} />
    </CheatcodesTemplateScreen>
  )
}
