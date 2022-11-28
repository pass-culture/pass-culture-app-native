import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NavigationAccountSuspension(): JSX.Element {
  return (
    <ScrollView>
      <PageHeaderSecondary title="Account Management 🎨" />
      <StyledContainer>
        <LinkToComponent name="FraudulentAccount" />
        <LinkToComponent name="SuspendedAccount" />
        <LinkToComponent name="AccountReactivationSuccess" />
        <LinkToComponent name="ConfirmDeleteProfile" />
        <LinkToComponent name="DeleteProfileSuccess" />
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
