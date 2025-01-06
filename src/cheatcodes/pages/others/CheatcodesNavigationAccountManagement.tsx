import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'

export function CheatcodesNavigationAccountManagement(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Account Management ⚙️">
      <LinkToScreen screen="FraudulentSuspendedAccount" />
      <LinkToScreen screen="SuspendedAccountUponUserRequest" />
      <LinkToScreen screen="AccountReactivationSuccess" />
      <LinkToScreen screen="DeleteProfileReason" />
      <LinkToScreen screen="ConfirmDeleteProfile" />
      <LinkToScreen screen="DeactivateProfileSuccess" />
      <LinkToScreen screen="DeleteProfileSuccess" />
      <LinkToScreen screen="DeleteProfileConfirmation" />
      <LinkToScreen screen="ResetPasswordExpiredLink" />
      <LinkToScreen
        screen="ResetPasswordEmailSent"
        navigationParams={{ email: 'jean.dupont@gmail.com' }}
      />
      <LinkToScreen screen="DeleteProfileAccountNotDeletable" />
      <LinkToScreen screen="DeleteProfileAccountHacked" />
    </CheatcodesTemplateScreen>
  )
}
