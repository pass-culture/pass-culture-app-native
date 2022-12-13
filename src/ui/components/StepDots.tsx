import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DotComponent } from './DotComponent'

interface Props {
  numberOfSteps: number
  currentStep: number
  withNeutralPreviousStepsColor?: boolean
}

export const StepDots: FunctionComponent<Props> = (props) => {
  const currentStepIndex = props.currentStep - 1
  return (
    <StepsContainer>
      {[...Array(props.numberOfSteps)].map((_val, index) => {
        return (
          <DotComponent
            key={index}
            index={index}
            activeIndex={currentStepIndex}
            numberOfSteps={props.numberOfSteps}
            isActive={index === currentStepIndex}
            withNeutralPreviousStepsColor={props.withNeutralPreviousStepsColor}
          />
        )
      })}
    </StepsContainer>
  )
}

const StepsContainer = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})
