import React, { FunctionComponent } from 'react'
import { SwiperProps } from 'react-native-web-swiper'
import styled, { DefaultTheme } from 'styled-components/native'

import { ColorsTypeLegacy } from 'theme/types'
import { Dot as DotIcon } from 'ui/svg/icons/Dot'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports

function getDotColors(
  theme: DefaultTheme,
  stepIndex: number,
  currentStepIndex: number,
  withNeutralPreviousStepsColor?: boolean
): { borderColor?: ColorsTypeLegacy; fillColor?: ColorsTypeLegacy } {
  if (stepIndex === currentStepIndex)
    return {
      borderColor: theme.designSystem.color.border.brandPrimary,
      fillColor: theme.designSystem.color.background.brandPrimary,
    }
  if (stepIndex < currentStepIndex && !withNeutralPreviousStepsColor)
    return { borderColor: theme.colors.greenValid, fillColor: theme.colors.greenValid }
  return {
    borderColor: theme.designSystem.color.border.default,
    fillColor: theme.designSystem.color.background.default,
  }
}

function getStyledDot(
  stepIndex: number,
  currentStepIndex: number,
  withNeutralPreviousStepsColor = false
) {
  return styled(DotIcon).attrs(({ theme }) =>
    getDotColors(theme, stepIndex, currentStepIndex, withNeutralPreviousStepsColor)
  )``
}

const CURRENT_STEP_SIZE = 12
const DEFAULT_SIZE = 8

type DotComponentProps = SwiperProps & {
  index: number
  activeIndex: number
  numberOfSteps: number
  isActive: boolean
  withNeutralPreviousStepsColor?: boolean
}

export const DotComponent: FunctionComponent<DotComponentProps> = (props) => {
  const Dot = getStyledDot(props.index, props.activeIndex, props.withNeutralPreviousStepsColor)
  const step = props.index + 1
  const totalSteps = props.numberOfSteps

  let status = 'à faire'
  if (props.isActive) {
    status = 'en cours'
  } else if (props.index < props.activeIndex) {
    status = 'réalisée'
  }

  return (
    <DotContainer>
      <Dot
        accessibilityLabel={`Étape ${step} sur ${totalSteps} ${status}`}
        size={props.isActive ? CURRENT_STEP_SIZE : DEFAULT_SIZE}
        testID="dot-icon"
      />
    </DotContainer>
  )
}

const DotContainer = styled.View({
  alignSelf: 'center',
  marginLeft: getSpacing(1),
  marginRight: getSpacing(1),
})
