import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExMDkyLCJkYXRlQ3JlYXRlZCI6IjIwMjMtMDYtMDdUMDc6NDQ6NDguNTY4MzAzWiIsImxvY2F0aW9uIjpudWxsLCJvcyI6ImlPUyIsInNvdXJjZSI6ImlQaG9uZSAxMyJ9.Rg8LwaFCMaDQV1ThoyTALYj7clEix-LmrM1JyPTXwTU'

export function NavigationTrustedDevice(): JSX.Element {
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
