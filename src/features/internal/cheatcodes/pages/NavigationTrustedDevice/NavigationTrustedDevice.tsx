import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { getSpacing, Spacer } from 'ui/theme'

export function NavigationTrustedDevice(): React.JSX.Element {
  const [value, setValue] = useState('')

  return (
    <ScrollView>
      <PageHeaderSecondary title="Trusted device 📱" />
      <StyledContainer>
        <LinkToComponent name="TrustedDeviceInfos" />
        <LinkToComponent name="SuspensionChoice" />
        <LinkToComponent name="SuspensionChoiceExpiredLink" />
        <LinkToComponent name="SuspiciousLoginSuspendedAccount" />
        <LinkToComponent name="AccountSecurity" navigationParams={ROUTE_PARAMS} />
        <BufferContainer>
          <LinkToComponent
            name="AccountSecurityBuffer"
            navigationParams={{ ...ROUTE_PARAMS, token: value }}
            half={false}
            disabled={value.length < 1}
          />
          <TextInput
            onChangeText={setValue}
            placeholder="Rentrer un token pour activer le bouton"
          />
        </BufferContainer>
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

const BufferContainer = styled.View(({ theme }) => ({
  borderWidth: getSpacing(0.5),
  borderColor: theme.colors.greyMedium,
  borderRadius: getSpacing(5),
  flex: 1,
  width: '50%',
  paddingBottom: getSpacing(2),
  paddingHorizontal: getSpacing(1.5),
}))
