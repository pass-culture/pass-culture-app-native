import React from 'react'
import styled from 'styled-components/native'

import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { getSpacing, Typo } from 'ui/theme'

type CulturalSurveyProgressBarProps = {
  progress: number
}

export const CulturalSurveyProgressBar = (props: CulturalSurveyProgressBarProps) => {
  const progressPercent = `${props.progress * 100}%`

  return (
    <VerticalContainer>
      <Container>
        <ProgressBarContainer>
          <ProgressBar progress={props.progress} />
        </ProgressBarContainer>
        <PercentageContainer>
          <SurveyProgressPercentage>{progressPercent}</SurveyProgressPercentage>
        </PercentageContainer>
      </Container>
    </VerticalContainer>
  )
}

const VerticalContainer = styled.View({
  flexGrow: 1,
})

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  height: getSpacing(6),
})

const PercentageContainer = styled.View({
  alignSelf: 'center',
})

const SurveyProgressPercentage = styled(Typo.BodyAccentXs)({
  marginLeft: getSpacing(2),
})

const ProgressBarContainer = styled.View({
  flex: 1,
  alignSelf: 'center',
  maxWidth: getSpacing(51),
})
