import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { ProgressBar } from 'ui/designSystem/ProgressBar/ProgressBar'
import { getSpacing } from 'ui/theme'

const DEFAULT_PROGRESS_BAR_MAX_WIDTH = getSpacing(51)
const WEB_PROGRESS_BAR_MAX_WIDTH = getSpacing(80)

type CulturalSurveyProgressBarProps = {
  progress: number
}

export const CulturalSurveyProgressBar = (props: CulturalSurveyProgressBarProps) => {
  const progressPercentage = props.progress * 100

  return (
    <VerticalContainer>
      <ProgressBarContainer>
        <ProgressBar
          value={progressPercentage}
          labelPosition="right"
          accessibilityLabel="Progression du questionnaire culturel"
        />
      </ProgressBarContainer>
    </VerticalContainer>
  )
}

const VerticalContainer = styled.View({
  flexGrow: 1,
})

const ProgressBarContainer = styled.View(({ theme }) => ({
  flex: 1,
  alignSelf: 'flex-start',
  justifyContent: 'center',
  height: theme.designSystem.size.spacing.xl,
  width: '100%',
  maxWidth: Platform.OS === 'web' ? WEB_PROGRESS_BAR_MAX_WIDTH : DEFAULT_PROGRESS_BAR_MAX_WIDTH,
}))
