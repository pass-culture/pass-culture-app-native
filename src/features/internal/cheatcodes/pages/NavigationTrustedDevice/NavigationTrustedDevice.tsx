import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { getSpacing, Spacer } from 'ui/theme'

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibG9jYXRpb24iOiJQYXJpcyIsImRhdGVDcmVhdGVkIjoiMjAyMy0wNi0wOVQxMDowMDowMFoiLCJvcyI6ImlPUyIsInNvdXJjZSI6ImlQaG9uZSAxMyJ9.0x9m4wEh0QKefPSsCOJDVrA-xVRGnUcoJR_vEbjNtaE'

export function NavigationTrustedDevice(): React.JSX.Element {
  const [value, setValue] = useState('')

  return (
    <ScrollView>
      <PageHeaderSecondary title="Trusted device 📱" />
      <StyledContainer>
        <LinkToComponent name="TrustedDeviceInfos" />
        <LinkToComponent name="SuspensionChoice" />
        <LinkToComponent name="SuspensionChoiceExpiredLink" />
        <LinkToComponent name="SuspensionConfirmation" />
        <LinkToComponent name="AccountSecurity" navigationParams={{ token: TOKEN }} />
        <BufferContainer>
          <LinkToComponent
            name="AccountSecurityBuffer"
            navigationParams={{ token: value }}
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
