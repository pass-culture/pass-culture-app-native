import React from 'react'
import { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Dot } from 'ui/svg/icons/Dot'
import { ColorsEnum, Spacer } from 'ui/theme'

interface Props {
  numberOfSteps: number
  currentStep: number
}

const CURRENT_STEP_SIZE = 12
const DEFAULT_SIZE = 8

export const StepDots: FunctionComponent<Props> = (props) => {
  const currentStepIndex = props.currentStep - 1
  const lastStepIndex = props.numberOfSteps - 1

  function getColor(stepNumber: number) {
    if (stepNumber === currentStepIndex) {
      return ColorsEnum.PRIMARY
    }

    if (stepNumber < currentStepIndex) {
      return ColorsEnum.GREEN_VALID
    }

    return ColorsEnum.GREY_MEDIUM
  }

  return (
    <StepsContainer>
      {[...Array(props.numberOfSteps)].map((val, index) => (
        <React.Fragment key={index}>
          <DotContainer>
            <Dot
              color={getColor(index)}
              size={currentStepIndex === index ? CURRENT_STEP_SIZE : DEFAULT_SIZE}
              testID="dot-icon"
            />
          </DotContainer>
          {index !== lastStepIndex ? <Spacer.Row numberOfSpaces={2} /> : null}
        </React.Fragment>
      ))}
    </StepsContainer>
  )
}

const StepsContainer = styled.View({ display: 'flex', flexDirection: 'row' })

const DotContainer = styled.View({
  alignSelf: 'center',
})
