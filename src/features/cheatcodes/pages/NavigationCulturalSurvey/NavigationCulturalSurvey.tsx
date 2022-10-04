import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/cheatcodes/components/LinkToComponent'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

export function NavigationCulturalSurvey(): JSX.Element {
  return (
    <ScrollView>
      <PageHeader title="CulturalSurvey 🎨" position="absolute" withGoBackButton />
      <StyledContainer>
        <LinkToComponent name="CulturalSurveyIntro" />
        <LinkToComponent name="CulturalSurveyQuestions" />
        <LinkToComponent name="CulturalSurveyThanks" />
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
