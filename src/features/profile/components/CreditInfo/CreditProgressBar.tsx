import React, { memo } from 'react'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { getSpacing } from 'ui/theme'

enum BarHeight {
  'normal' = 4.5,
  'small' = 2,
  'smaller' = 1,
}

interface CreditProgressBarProps {
  progress: number
  color: ColorsType
  height?: 'normal' | 'small' | 'smaller'
}

const MINIMUM_PROGRESS_BAR_SIZE = 0.02
const MINIMUM_PROGRESS_BAR_SIZE_SM = 0.07
const MINIMUM_PROGRESS_BAR_SIZE_MD = 0.03
const PROGRESS_BAR_BORDER_RADIUS = getSpacing(12)

const CreditProgressBarComponent: React.FC<CreditProgressBarProps> = ({
  color,
  progress,
  height = 'normal',
}) => {
  return (
    <Container>
      <ProgressBarContainer height={height}>
        {height === 'normal' ? <BaseShadowGradient /> : null}
        <LinearGradientBar progress={progress} color={color} testID="progress-bar" />
      </ProgressBarContainer>
    </Container>
  )
}

export const CreditProgressBar = memo(
  styled(CreditProgressBarComponent).attrs(({ theme }) => ({
    color: theme.designSystem.color.background.brandPrimary,
  }))``
)

const LinearGradientBar = styled.View.attrs<CreditProgressBarProps>(({ color }) => ({
  color,
}))<CreditProgressBarProps>(({ theme, progress, color }) => {
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
    backgroundColor: color,
    borderRadius: PROGRESS_BAR_BORDER_RADIUS,
  }
})

const BaseShadowGradient = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: PROGRESS_BAR_BORDER_RADIUS,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

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
    height: getSpacing(height ? BarHeight[height] : BarHeight.normal),
    width: '100%',
    zIndex: theme.zIndex.progressbar,
    backgroundColor: height === 'small' ? theme.colors.greyMedium : theme.colors.white,
  })
)
