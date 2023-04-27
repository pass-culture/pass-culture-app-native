import React, { ReactNode } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { StepVariant } from 'features/profile/components/VerticalStepper/types'
import { VerticalStepper } from 'features/profile/components/VerticalStepper/VerticalStepper'
import { getSpacing } from 'ui/theme'

export interface StepProps {
  /**
   * Use this prop to handle correct stepper step.
   *
   * There is 3 variants available:
   * - `VerticalStepperVariant.complete` for completed step
   * - `VerticalStepperVariant.in_progress` for in-progress step
   * - `VerticalStepperVariant.future` for future step
   *
   * Each one has its own styling, and it should always be only one "in-progress" step.
   * It may exist 0 or more completed and future steps.
   */
  variant: StepVariant
  /**
   * This content will be shown on the right side of this component.
   */
  children: ReactNode
}

export function Step({ variant, children }: StepProps) {
  return (
    <Wrapper>
      <View>
        <VerticalStepper variant={variant} />
      </View>
      <Content>{children}</Content>
    </Wrapper>
  )
}

const Wrapper = styled.View({
  flexGrow: 1,
  flexDirection: 'row',
  gap: getSpacing(2),
})

const Content = styled.View({
  flexGrow: 1,
})
