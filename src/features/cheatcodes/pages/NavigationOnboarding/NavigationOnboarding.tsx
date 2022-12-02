import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NavigationOnboarding(): JSX.Element {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )

  return (
    <ScrollView>
      <PageHeaderSecondary title="Onboarding 🛶" />
      <StyledContainer>
        <LinkToComponent name="OnboardingAuthentication" />
        <LinkToComponent name="AgeSelection" />
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
