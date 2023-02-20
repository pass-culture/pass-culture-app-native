import React, { memo } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { UniqueColors, ColorsEnum } from 'ui/theme/colors'

interface ProgressBarProps {
  progress: number
  colors: Array<ColorsEnum | UniqueColors>
  height?: number
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({ colors, progress, height = 40 }) => {
  const LinearColors = colors.length === 1 ? [colors[0], colors[0]] : colors

  const LinearGradientBar = styled(LinearGradient).attrs({
    colors: LinearColors,
    useAngle: true,
    angle: 90,
  })({ flex: progress, borderRadius: getSpacing(12) })

  return (
    <Container height={height}>
      <ProgressBarContainer>
        <LinearGradientBar testID="progress-bar" />
      </ProgressBarContainer>
    </Container>
  )
}

export const ProgressBar = memo(ProgressBarComponent)

const Container = styled.View<{ height: number }>(({ height }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  height,
  maxHeight: 40,
}))

const ProgressBarContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  flex: 1,
  border: 1,
  borderColor: theme.colors.greyMedium,
  borderRadius: getSpacing(12),
  height: getSpacing(1.5),
  zIndex: theme.zIndex.progressbar,
}))
