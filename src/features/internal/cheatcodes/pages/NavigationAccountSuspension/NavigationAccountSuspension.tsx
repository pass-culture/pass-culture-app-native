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
        <LinkToComponent name="FraudulentSuspendedAccount" />
        <LinkToComponent name="SuspendedAccountUponUserRequest" />
        <LinkToComponent name="AccountReactivationSuccess" />
        <LinkToComponent name="DeleteProfileReason" />
        <LinkToComponent name="ConfirmDeleteProfile" />
        <LinkToComponent name="DeactivateProfileSuccess" />
        <LinkToComponent name="DeleteProfileConfirmation" />
        <LinkToComponent name="ResetPasswordExpiredLink" />
        <LinkToComponent
          name="ResetPasswordEmailSent"
          navigationParams={{
            email: 'jean.dupont@gmail.com',
          }}
        />
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
