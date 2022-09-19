import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { useGoBack } from 'features/navigation/useGoBack'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Spacer } from 'ui/theme'

export function NavigationAccountSuspension(): JSX.Element {
  const { goBack } = useGoBack('Navigation', undefined)

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="Account Management 🎨"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
      />
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
