import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Spacer } from 'ui/theme'

export function NavigationAccountSuspension(): React.JSX.Element {
  return (
    <ScrollView>
      <CheatcodesHeader title="Account Management ⚙️" />
      <StyledContainer>
        <LinkToComponent name="FraudulentSuspendedAccount" half={false} />
        <LinkToComponent name="SuspendedAccountUponUserRequest" half={false} />
        <LinkToComponent name="AccountReactivationSuccess" half={false} />
        <LinkToComponent name="DeleteProfileReason" half={false} />
        <LinkToComponent name="ConfirmDeleteProfile" half={false} />
        <LinkToComponent name="DeactivateProfileSuccess" half={false} />
        <LinkToComponent name="DeleteProfileSuccess" half={false} />
        <LinkToComponent name="DeleteProfileConfirmation" half={false} />
        <LinkToComponent name="ResetPasswordExpiredLink" half={false} />
        <LinkToComponent
          name="ResetPasswordEmailSent"
          navigationParams={{
            email: 'jean.dupont@gmail.com',
          }}
          half={false}
        />
        <LinkToComponent name="DeleteProfileAccountNotDeletable" half={false} />
        <LinkToComponent name="DeleteProfileAccountHacked" half={false} />
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
