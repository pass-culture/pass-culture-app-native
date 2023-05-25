import React, { useReducer } from 'react'
import styled from 'styled-components/native'

import { ProgressBar } from 'features/auth/pages/signup/ProgressBar/ProgressBar'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { getSpacing } from 'ui/theme'

export const SignupProgressBar = () => {
  const [currentStep, updateStep] = useReducer((v: number, incr: number) => v + incr, 1)
  const goToNextStep = () => updateStep(1)
  const goToPreviousStep = () => updateStep(-1)

  return (
    <React.Fragment>
      <PageHeaderSecondary title="SignupProgressBar" />
      <ProgressBar currentStep={currentStep} totalStep={5} />
      <ButtonContainer>
        <StyledButton
          wording="Previous Step"
          onPress={goToPreviousStep}
          disabled={currentStep === 1}
        />
        <StyledButton wording="Next Step" onPress={goToNextStep} disabled={currentStep === 5} />
      </ButtonContainer>
    </React.Fragment>
  )
}

const StyledButton = styledButton(ButtonTertiaryBlack)({
  width: '45%',
  margin: getSpacing(2),
})

const ButtonContainer = styled.View({
  flexDirection: 'row',
  margin: getSpacing(2),
  justifyContent: 'center',
})
