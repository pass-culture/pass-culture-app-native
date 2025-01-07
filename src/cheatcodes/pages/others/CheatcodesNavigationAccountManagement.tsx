import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationAccountManagementButtons: [CheatcodesButtonsWithSubscreensProps] =
  [
    {
      title: 'Account Management ⚙️',
      screen: 'CheatcodesNavigationAccountManagement',
      subscreens: [
        { screen: 'FraudulentSuspendedAccount' },
        { screen: 'SuspendedAccountUponUserRequest' },
        { screen: 'AccountReactivationSuccess' },
        { screen: 'DeleteProfileReason' },
        { screen: 'ConfirmDeleteProfile' },
        { screen: 'DeactivateProfileSuccess' },
        { screen: 'DeleteProfileSuccess' },
        { screen: 'DeleteProfileConfirmation' },
        { screen: 'ResetPasswordExpiredLink' },
        { screen: 'DeleteProfileAccountNotDeletable' },
        { screen: 'DeleteProfileAccountHacked' },
        { screen: 'ResetPasswordEmailSent', navigationParams: { email: 'jean.dupont@gmail.com' } },
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
