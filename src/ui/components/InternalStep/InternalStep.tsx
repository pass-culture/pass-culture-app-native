import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { StepProps } from 'ui/components/Step/Step'
import {
  VerticalStepper,
  VerticalStepperProps,
} from 'ui/components/VerticalStepper/VerticalStepper'

type InternalStepProps = StepProps & VerticalStepperProps

export function InternalStep({
  variant,
  children,
  isFirst,
  isLast,
  iconComponent,
  addMoreSpacingToIcons = false,
}: InternalStepProps) {
  return (
    <Wrapper>
      <View>
        <VerticalStepper
          variant={variant}
          isFirst={isFirst}
          isLast={isLast}
          iconComponent={iconComponent}
          addMoreSpacingToIcons={addMoreSpacingToIcons}
        />
      </View>
      <Content>{children}</Content>
    </Wrapper>
  )
}

const Wrapper = styled.View({
  flexGrow: 1,
  flexDirection: 'row',
})

const Content = styled.View(({ theme }) => ({
  flex: 1,
  marginHorizontal: theme.designSystem.size.spacing.s,
}))
