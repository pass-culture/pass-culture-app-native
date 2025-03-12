import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'

export const cheatcodesNavigationAccountManagementButtons: [CheatcodesButtonsWithSubscreensProps] =
  [
    {
      title: 'Account Management ⚙️',
      screen: 'CheatcodesNavigationAccountManagement',
      subscreens: [
        { screen: 'FraudulentSuspendedAccount' },
        { screen: 'SuspendedAccountUponUserRequest' },
        { screen: 'AccountReactivationSuccess' },
        { ...getProfileNavConfig('DeleteProfileReason') },
        { ...getProfileNavConfig('ConfirmDeleteProfile') },
        { ...getProfileNavConfig('DeactivateProfileSuccess') },
        { ...getProfileNavConfig('DeleteProfileSuccess') },
        { ...getProfileNavConfig('DeleteProfileConfirmation') },
        { screen: 'ResetPasswordExpiredLink' },
        { ...getProfileNavConfig('DeleteProfileAccountNotDeletable') },
        { ...getProfileNavConfig('DeleteProfileAccountHacked') },
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
