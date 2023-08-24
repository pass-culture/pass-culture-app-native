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
  height?: 'normal' | 'small'
}

const MINIMUM_PROGRESS_BAR_SIZE = 0.02
const MINIMUM_PROGRESS_BAR_SIZE_SM = 0.07
const MINIMUM_PROGRESS_BAR_SIZE_MD = 0.03
const PROGRESS_BAR_BORDER_RADIUS = getSpacing(12)

const CreditProgressBarComponent: React.FC<CreditProgressBarProps> = ({
  colors,
  progress,
  height = 'normal',
}) => {
  const shadowColors = [colorAlpha(colors[0], 0.1), colorAlpha(colors[1], 0.1)]

  return (
    <Container>
      <ProgressBarContainer height={height}>
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
)<Pick<CreditProgressBarProps, 'progress'>>(({ theme, progress }) => {
  let flex
  if (progress === 0) {
    flex = progress
  } else if (theme.appContentWidth < theme.breakpoints.sm) {
    flex = Math.max(progress, MINIMUM_PROGRESS_BAR_SIZE_SM)
  } else if (theme.appContentWidth < theme.breakpoints.md) {
    flex = Math.max(progress, MINIMUM_PROGRESS_BAR_SIZE_MD)
  } else {
    flex = Math.max(progress, MINIMUM_PROGRESS_BAR_SIZE)
  }

  return {
    flex,
    borderRadius: PROGRESS_BAR_BORDER_RADIUS,
  }
})

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

const ProgressBarContainer = styled.View<Pick<CreditProgressBarProps, 'height'>>(
  ({ theme, height }) => ({
    flexDirection: 'row',
    borderRadius: PROGRESS_BAR_BORDER_RADIUS,
    height: getSpacing(height === 'normal' ? 4.5 : 2),
    width: '100%',
    zIndex: theme.zIndex.progressbar,
    backgroundColor: theme.colors.white,
  })
)
