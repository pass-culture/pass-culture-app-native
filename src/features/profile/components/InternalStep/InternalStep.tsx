import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { FirstOrLastProps, StepVariantProps } from 'features/profile/types'
import { getSpacing } from 'ui/theme'

import { StepProps } from '../Step/Step'
import { VerticalStepper } from '../VerticalStepper/VerticalStepper'

export type InternalStepProps = StepProps & FirstOrLastProps & StepVariantProps

export function InternalStep({ variant, children, isFirst, isLast }: InternalStepProps) {
  return (
    <Wrapper>
      <View>
        <VerticalStepper variant={variant} isFirst={isFirst} isLast={isLast} />
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
