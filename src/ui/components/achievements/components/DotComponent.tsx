import React, { FunctionComponent } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { SwiperProps } from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { Dot } from 'ui/svg/icons/Dot'
import { ColorsEnum, getSpacing } from 'ui/theme'

const CURRENT_STEP_SIZE = 12
const DEFAULT_SIZE = 8

type DotComponentProps = SwiperProps & {
  index: number
  activeIndex: number
  isActive: boolean
  onPress?: () => void
}

export function getColor(stepNumber: number, activeIndex: number) {
  if (stepNumber === activeIndex) {
    return ColorsEnum.PRIMARY
  }

  if (stepNumber < activeIndex) {
    return ColorsEnum.GREEN_VALID
  }

  return ColorsEnum.GREY_MEDIUM
}

export const DotComponent: FunctionComponent<DotComponentProps> = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress} testID="button">
      <DotContainer>
        <Dot
          color={getColor(props.index, props.activeIndex)}
          size={props.isActive ? CURRENT_STEP_SIZE : DEFAULT_SIZE}
          testID="dot-icon"
        />
      </DotContainer>
    </TouchableWithoutFeedback>
  )
}

const DotContainer = styled.View({
  alignSelf: 'center',
  marginLeft: getSpacing(1),
  marginRight: getSpacing(1),
})
