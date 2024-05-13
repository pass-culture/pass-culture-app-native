import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Spacer } from 'ui/theme'

export function NavigationCulturalSurvey(): React.JSX.Element {
  return (
    <ScrollView>
      <CheatcodesHeader title="CulturalSurvey 🎨" />
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
