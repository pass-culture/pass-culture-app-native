import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer } from 'ui/theme'

export function NavigationCulturalSurvey(): JSX.Element {
  return (
    <ScrollView>
      <PageHeaderSecondary title="CulturalSurvey 🎨" />
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
