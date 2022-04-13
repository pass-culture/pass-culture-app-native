import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { SwiperProps } from 'react-native-web-swiper'
import styled, { DefaultTheme } from 'styled-components/native'

import { Touchable } from 'ui/components/touchable/Touchable'
import { Dot } from 'ui/svg/icons/Dot'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
export function getDotColors(
  theme: DefaultTheme,
  stepIndex: number,
  currentStepIndex: number
): { borderColor?: ColorsEnum; fillColor?: ColorsEnum } {
  if (stepIndex === currentStepIndex)
    return { borderColor: theme.colors.primary, fillColor: theme.colors.primary }
  if (stepIndex < currentStepIndex)
    return { borderColor: theme.colors.greenValid, fillColor: theme.colors.greenValid }
  return { borderColor: theme.colors.greyDark, fillColor: theme.colors.transparent }
}

function getStyledDot(stepIndex: number, currentStepIndex: number) {
  return styled(Dot).attrs(({ theme }) => getDotColors(theme, stepIndex, currentStepIndex))``
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

export const DotComponent: FunctionComponent<DotComponentProps> = (props) => {
  const Dot = getStyledDot(props.index, props.activeIndex)
  const step = props.index + 1
  const totalSteps = props.numberOfSteps
  const clickable = !!props.onPress

  let status = t`à faire`
  if (props.isActive) {
    status = t`en cours`
  } else if (props.index < props.activeIndex) {
    status = t`réalisée`
  }

  return (
    <Touchable
      activeOpacity={1}
      onPress={props.onPress}
      testID="button"
      disabled={!clickable}
      aria-hidden={!clickable}>
      <DotContainer>
        <Dot
          accessibilityLabel={clickable ? t`Étape ${step} sur ${totalSteps} ${status}` : undefined}
          size={props.isActive ? CURRENT_STEP_SIZE : DEFAULT_SIZE}
          testID="dot-icon"
        />
      </DotContainer>
    </Touchable>
  )
}

const DotContainer = styled.View({
  alignSelf: 'center',
  marginLeft: getSpacing(1),
  marginRight: getSpacing(1),
})
