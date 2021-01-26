import React, { FunctionComponent, memo } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme'

export interface ProgressBarProps {
  progress: number
  color: ColorsEnum
  icon: FunctionComponent<IconInterface>
}

function ProgressBarComponent(props: ProgressBarProps) {
  const Icon = props.icon
  return (
    <Container>
      <IconContainer backgroundColor={props.color}>
        <Icon color={ColorsEnum.WHITE} testID="progress-bar-icon" />
      </IconContainer>
      <ProgressBarContainer>
        <Bar backgroundColor={props.color} progress={props.progress} testID="progress-bar" />
      </ProgressBarContainer>
    </Container>
  )
}

export const ProgressBar = memo(ProgressBarComponent)

const Container = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: 40,
  maxHeight: 40,
})

const IconContainer = styled.View<{ backgroundColor: string }>(({ backgroundColor }) => ({
  width: 32,
  height: 32,
  borderRadius: 32,
  backgroundColor,
  zIndex: 2,
}))

const ProgressBarContainer = styled.View({
  flexDirection: 'row',
  overflow: 'hidden',
  flex: 1,
  borderWidth: 2,
  borderColor: ColorsEnum.GREY_MEDIUM,
  borderRadius: 20,
  height: 20,
  left: -10,
  zIndex: 1,
})

const Bar = styled.View<{ backgroundColor: string; progress: number }>(
  ({ backgroundColor, progress }) => ({
    flex: progress,
    backgroundColor,
  })
)
