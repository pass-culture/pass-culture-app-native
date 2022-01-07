import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { SwiperProps } from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { Dot } from 'ui/svg/icons/Dot'
import { ColorsEnum, getSpacing } from 'ui/theme'

export function getDotColors(
  stepIndex: number,
  currentStepIndex: number
): { borderColor?: ColorsEnum; fillColor?: ColorsEnum } {
  if (stepIndex === currentStepIndex)
    return { borderColor: ColorsEnum.PRIMARY, fillColor: ColorsEnum.PRIMARY }
  if (stepIndex < currentStepIndex)
    return { borderColor: ColorsEnum.GREEN_VALID, fillColor: ColorsEnum.GREEN_VALID }
  return { borderColor: ColorsEnum.GREY_DARK, fillColor: ColorsEnum.TRANSPARENT }
}

const CURRENT_STEP_SIZE = 12
const DEFAULT_SIZE = 8

type DotComponentProps = SwiperProps & {
  index: number
  activeIndex: number
  numberOfSteps: number
  isActive: boolean
  onPress?: () => void
}

const WHITESPACE = '\u00a0'

const STATUS = {
  IN_PROGRESS: WHITESPACE + t`en cours`,
  DONE: WHITESPACE + t`réalisée`,
  TODO: WHITESPACE + t`à faire`,
}

export const DotComponent: FunctionComponent<DotComponentProps> = (props) => {
  const { borderColor, fillColor } = getDotColors(props.index, props.activeIndex)
  let status = STATUS.TODO
  if (props.isActive) {
    status = STATUS.IN_PROGRESS
  } else if (props.index < props.activeIndex) {
    status = STATUS.DONE
  }
  const ariaLabel =
    t`Étape` +
    WHITESPACE +
    (props.index + 1) +
    WHITESPACE +
    t`sur` +
    WHITESPACE +
    props.numberOfSteps +
    status
  return (
    <TouchableWithoutFeedback onPress={props.onPress} testID="button">
      <DotContainer>
        <Dot
          aria-label={ariaLabel}
          borderColor={borderColor}
          fillColor={fillColor}
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
