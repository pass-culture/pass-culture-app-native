import React, { memo } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getSpacing } from 'ui/theme'

interface ProgressBarProps {
  progress: number
  height?: number
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({ progress, height = 1.5 }) => {
  const LinearGradientBar = styled.View(({ theme }) => ({
    backgroundColor: theme.designSystem.color.background.brandPrimary,
    flex: Math.max(progress),
  }))

  const progressString = `${Math.round(progress * 100)}`

  return (
    <Container
      accessibilityLabel={`Barre de progression\u00a0: ${progressString}%`}
      accessibilityRole={AccessibilityRole.PROGRESSBAR}
      accessible>
      <ProgressBarContainer height={height}>
        <LinearGradientBar testID="progress-bar" />
      </ProgressBarContainer>
    </Container>
  )
}

export const ProgressBar = memo(ProgressBarComponent)

const Container = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  maxHeight: 40,
}))

const ProgressBarContainer = styled.View<{ height?: number }>(({ theme, height }) => ({
  flexDirection: 'row',
  flex: 1,
  border: 1,
  borderColor: theme.designSystem.color.border.disabled,
  borderRadius: theme.designSystem.size.borderRadius.pill,
  height: getSpacing(height ?? 1.5),
  zIndex: theme.zIndex.progressbar,
}))
