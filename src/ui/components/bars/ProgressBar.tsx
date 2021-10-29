import React, { FunctionComponent, memo } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing } from 'ui/theme'
import { ZIndex } from 'ui/theme/layers'

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
  flexDirection: 'row',
  alignItems: 'center',
  height: 40,
  maxHeight: 40,
})

const IconContainer = styled.View<{ backgroundColor: string }>(({ backgroundColor }) => ({
  width: 32,
  height: 32,
  borderRadius: 32,
  backgroundColor,
  zIndex: ZIndex.PROGRESSBAR_ICON,
  position: 'absolute',
}))

const ProgressBarContainer = styled.View({
  marginLeft: getSpacing(5),
  flexDirection: 'row',
  overflow: 'hidden',
  flex: 1,
  borderWidth: 2,
  borderColor: ColorsEnum.GREY_MEDIUM,
  borderRadius: 20,
  height: 20,
  zIndex: ZIndex.PROGRESSBAR,
  position: 'relative',
})

const Bar = styled.View<{ backgroundColor: string; progress: number }>(
  ({ backgroundColor, progress }) => ({
    flex: progress,
    backgroundColor,
  })
)
