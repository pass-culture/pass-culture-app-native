import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NavigationProfileTutorial(): React.JSX.Element {
  return (
    <ScrollView>
      <PageHeaderSecondary title="Tutoriel profil" />
      <StyledContainer>
        <LinkToComponent name="AgeSelection" navigationParams={{ type: 'profileTutorial' }} />
        <LinkToComponent name="AgeSelectionOther" />
        <LinkToComponent
          name="ProfileTutorialAgeInformation"
          title="ProfileTutorialAgeInformation - 15 ans"
          navigationParams={{ selectedAge: 15 }}
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
