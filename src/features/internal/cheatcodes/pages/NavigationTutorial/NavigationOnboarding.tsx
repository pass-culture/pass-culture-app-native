import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StatusBar } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { TutorialTypes } from 'features/tutorial/enums'
import { Spacer } from 'ui/theme'

export function NavigationOnboarding(): React.JSX.Element {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)
      return () => StatusBar.setBarStyle('dark-content', true)
    }, [])
  )

  return (
    <ScrollView>
      <CheatcodesHeader title="Onboarding 🛶" />
      <StyledContainer>
        <LinkToComponent name="OnboardingWelcome" />
        <LinkToComponent name="OnboardingGeolocation" />
        <LinkToComponent
          name="AgeSelection"
          navigationParams={{ type: TutorialTypes.ONBOARDING }}
        />
        <LinkToComponent
          name="AgeSelectionOther"
          navigationParams={{ type: TutorialTypes.ONBOARDING }}
        />
        <LinkToComponent
          name="OnboardingAgeInformation"
          title="AgeInfo - 15 ans"
          navigationParams={{ age: 15 }}
        />
        <LinkToComponent
          name="OnboardingAgeInformation"
          title="AgeInfo - 16 ans"
          navigationParams={{ age: 16 }}
        />
        <LinkToComponent
          name="OnboardingAgeInformation"
          title="AgeInfo - 17 ans"
          navigationParams={{ age: 17 }}
        />
        <LinkToComponent
          name="OnboardingAgeInformation"
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
