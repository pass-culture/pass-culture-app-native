import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'

export function CheatcodesNavigationAccountManagement(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Account Management ⚙️">
      <LinkToComponent name="FraudulentSuspendedAccount" />
      <LinkToComponent name="SuspendedAccountUponUserRequest" />
      <LinkToComponent name="AccountReactivationSuccess" />
      <LinkToComponent name="DeleteProfileReason" />
      <LinkToComponent name="ConfirmDeleteProfile" />
      <LinkToComponent name="DeactivateProfileSuccess" />
      <LinkToComponent name="DeleteProfileSuccess" />
      <LinkToComponent name="DeleteProfileConfirmation" />
      <LinkToComponent name="ResetPasswordExpiredLink" />
      <LinkToComponent
        name="ResetPasswordEmailSent"
        navigationParams={{ email: 'jean.dupont@gmail.com' }}
      />
      <LinkToComponent name="DeleteProfileAccountNotDeletable" />
      <LinkToComponent name="DeleteProfileAccountHacked" />
    </CheatcodesTemplateScreen>
  )
}
