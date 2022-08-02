import colorAlpha from 'color-alpha'
import React, { memo } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface CreditProgressBarProps {
  progress: number
  colors: ColorsEnum[]
}

const PROGRESS_BAR_BORDER_RADIUS = getSpacing(12)

const CreditProgressBarComponent: React.FC<CreditProgressBarProps> = ({ colors, progress }) => {
  const shadowColors = [colorAlpha(colors[0], 0.1), colorAlpha(colors[1], 0.1)]

  return (
    <Container>
      <ProgressBarContainer>
        <GradientShadow colors={shadowColors} />
        <SecondGradientShadow />
        <LinearGradientBar progress={progress} colors={colors} testID="progress-bar" />
      </ProgressBarContainer>
    </Container>
  )
}

export const CreditProgressBar = memo(
  styled(CreditProgressBarComponent).attrs(({ theme }) => ({
    colors: [theme.colors.primary, theme.colors.secondary],
  }))``
)

const LinearGradientBar = styled(LinearGradient).attrs<Pick<CreditProgressBarProps, 'colors'>>(
  ({ colors }) => ({
    colors,
    useAngle: true,
    angle: 90,
  })
)<Pick<CreditProgressBarProps, 'progress'>>(({ progress }) => ({
  flex: progress,
  borderRadius: PROGRESS_BAR_BORDER_RADIUS,
}))

const BaseShadowGradient = styled(LinearGradient)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: PROGRESS_BAR_BORDER_RADIUS,
})

const GradientShadow = styled(BaseShadowGradient).attrs<Pick<CreditProgressBarProps, 'colors'>>(
  ({ colors }) => ({
    useAngle: true,
    angle: 180,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    colors,
  })
)(({ theme }) => ({
  borderColor: theme.colors.white,
  borderWidth: getSpacing(0.5),
}))

// Used to give an inner shadow illusion
const SecondGradientShadow = styled(BaseShadowGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.colors.white, 0.2),
    colorAlpha(theme.colors.white, 1),
    colorAlpha(theme.colors.white, 0.2),
  ],
}))``

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: PROGRESS_BAR_BORDER_RADIUS,
})

const ProgressBarContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  borderRadius: PROGRESS_BAR_BORDER_RADIUS,
  height: getSpacing(4.5),
  width: '100%',
  zIndex: theme.zIndex.progressbar,
  backgroundColor: theme.colors.white,
}))
