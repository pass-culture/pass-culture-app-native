import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'

export function CheatcodesNavigationAccountManagement(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Account Management ⚙️">
      <LinkToComponent screen="FraudulentSuspendedAccount" />
      <LinkToComponent screen="SuspendedAccountUponUserRequest" />
      <LinkToComponent screen="AccountReactivationSuccess" />
      <LinkToComponent screen="DeleteProfileReason" />
      <LinkToComponent screen="ConfirmDeleteProfile" />
      <LinkToComponent screen="DeactivateProfileSuccess" />
      <LinkToComponent screen="DeleteProfileSuccess" />
      <LinkToComponent screen="DeleteProfileConfirmation" />
      <LinkToComponent screen="ResetPasswordExpiredLink" />
      <LinkToComponent
        screen="ResetPasswordEmailSent"
        navigationParams={{ email: 'jean.dupont@gmail.com' }}
      />
      <LinkToComponent screen="DeleteProfileAccountNotDeletable" />
      <LinkToComponent screen="DeleteProfileAccountHacked" />
    </CheatcodesTemplateScreen>
  )
}
