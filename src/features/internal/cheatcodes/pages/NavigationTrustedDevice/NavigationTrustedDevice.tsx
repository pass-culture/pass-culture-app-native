import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwibG9jYXRpb24iOiJQYXJpcyIsImRhdGVDcmVhdGVkIjoiMjAyMy0wNi0wOVQxMDowMDowMFoiLCJvcyI6ImlPUyIsInNvdXJjZSI6ImlQaG9uZSAxMyJ9.0x9m4wEh0QKefPSsCOJDVrA-xVRGnUcoJR_vEbjNtaE'

export function NavigationTrustedDevice(): React.JSX.Element {
  return (
    <ScrollView>
      <PageHeaderSecondary title="Trusted device 📱" />
      <StyledContainer>
        <LinkToComponent name="TrustedDeviceInfos" />
        <LinkToComponent name="SuspensionChoice" />
        <LinkToComponent name="SuspensionConfirmation" />
        <LinkToComponent name="AccountSecurity" navigationParams={{ token: TOKEN }} />
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
