import React, { memo } from 'react'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { Typo, getSpacing } from 'ui/theme'

enum BarHeight {
  'normal' = 4.5,
  'small' = 2,
  'smaller' = 1,
}

interface CreditProgressBarProps {
  progress: number
  color: ColorsType
  height?: 'normal' | 'small' | 'smaller'
  width?: string
  innerText?
}

const MINIMUM_PROGRESS_BAR_SIZE = 0.02
const MINIMUM_PROGRESS_BAR_SIZE_SM = 0.07
const MINIMUM_PROGRESS_BAR_SIZE_MD = 0.03

const CreditProgressBarComponent: React.FC<CreditProgressBarProps> = ({
  color,
  progress,
  height = 'normal',
  width = '100%',
  innerText,
}) => {
  return (
    <Container width={width}>
      <ProgressBarContainer height={height}>
        {height === 'normal' ? <BaseShadowGradient /> : null}
        <LinearGradientBar
          progress={progress}
          color={color}
          // style={{ alignSelf: 'center' }}
          testID="progress-bar">
          <Typo.BodyAccent style={{ color: 'white', textAlign: 'center' }}>
            {innerText}
          </Typo.BodyAccent>
        </LinearGradientBar>
      </ProgressBarContainer>
    </Container>
  )
}

export const CreditProgressBar = memo(
  styled(CreditProgressBarComponent).attrs<{
    color?: ColorsType
  }>(({ theme, color }) => ({
    color: color ?? theme.designSystem.color.background.brandPrimary,
  }))``
)
type CreditProgressPropsWithoutWidth = Omit<CreditProgressBarProps, 'width'>

const LinearGradientBar = styled.View.attrs<CreditProgressPropsWithoutWidth>(({ color }) => ({
  color,
}))<CreditProgressPropsWithoutWidth>(({ theme, progress, color }) => {
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
    borderRadius: theme.designSystem.size.borderRadius.pill,
  }
})

const BaseShadowGradient = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: theme.designSystem.size.borderRadius.pill,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const Container = styled.View<{ width: string }>`
  width: ${({ width }) => width};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const ProgressBarContainer = styled.View<Pick<CreditProgressBarProps, 'height'>>(
  ({ theme, height }) => ({
    flexDirection: 'row',
    borderRadius: theme.designSystem.size.borderRadius.pill,
    height: getSpacing(height ? BarHeight[height] : BarHeight.normal),
    width: '100%',
    zIndex: theme.zIndex.progressbar,
    backgroundColor:
      height === 'small'
        ? theme.designSystem.color.background.subtle
        : theme.designSystem.color.background.default,
  })
)
