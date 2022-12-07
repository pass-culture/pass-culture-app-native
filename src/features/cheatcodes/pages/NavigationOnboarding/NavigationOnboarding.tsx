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
        <LinkToComponent name="OnboardingWelcome" />
        <LinkToComponent name="AgeSelection" />
        <LinkToComponent name="AgeSelectionOther" />
        <LinkToComponent
          name="AgeInformation"
          title="AgeInfo - 15 ans"
          navigationParams={{ age: 15 }}
        />
        <LinkToComponent
          name="AgeInformation"
          title="AgeInfo - 16 ans"
          navigationParams={{ age: 16 }}
        />
        <LinkToComponent
          name="AgeInformation"
          title="AgeInfo - 17 ans"
          navigationParams={{ age: 17 }}
        />
        <LinkToComponent
          name="AgeInformation"
          title="AgeInfo - 18 ans"
          navigationParams={{ age: 18 }}
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
