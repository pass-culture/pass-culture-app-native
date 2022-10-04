import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

export function NavigationAccountSuspension(): JSX.Element {
  return (
    <ScrollView>
      <PageHeader title="Account Management 🎨" position="absolute" withGoBackButton />
      <StyledContainer>
        <LinkToComponent name="FraudulentAccount" />
        <LinkToComponent name="SuspendedAccount" />
        <LinkToComponent name="AccountReactivationSuccess" />
        <LinkToComponent name="ConfirmDeleteProfile" />
        <LinkToComponent name="DeleteProfileSuccess" />
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
