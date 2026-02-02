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

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  height: theme.designSystem.size.spacing.xl,
}))

const PercentageContainer = styled.View({
  alignSelf: 'center',
})

const SurveyProgressPercentage = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
}))

const ProgressBarContainer = styled.View({
  flex: 1,
  alignSelf: 'center',
  maxWidth: getSpacing(51),
})
