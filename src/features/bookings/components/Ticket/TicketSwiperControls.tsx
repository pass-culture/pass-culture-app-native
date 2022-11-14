import React from 'react'
import styled from 'styled-components/native'

import { ControlComponent } from 'ui/components/achievements/components/ControlComponent/ControlComponent'
import { StepDots } from 'ui/components/StepDots'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  numberOfSteps: number
  currentStep: number
  prevTitle: string
  nextTitle: string
  onPressPrev: () => void
  onPressNext: () => void
}

export function TicketSwiperControls({
  numberOfSteps,
  currentStep,
  prevTitle,
  nextTitle,
  onPressPrev,
  onPressNext,
}: Props) {
  const showPrevButton = currentStep > 1
  const showNextButton = currentStep !== numberOfSteps

  return (
    <DotsContainer testID="swiper-tickets-controls">
      {showPrevButton ? (
        <ControlComponent type="prev" title={prevTitle} onPress={onPressPrev} />
      ) : (
        <ControlComponentSpacing testID="control-component-spacing-prev" />
      )}
      <Spacer.Row numberOfSpaces={2} />
      <StepDots
        numberOfSteps={numberOfSteps}
        currentStep={currentStep}
        withNeutralPreviousStepsColor
      />
      <Spacer.Row numberOfSpaces={2} />
      {showNextButton ? (
        <ControlComponent type="next" title={nextTitle} onPress={onPressNext} />
      ) : (
        <ControlComponentSpacing testID="control-component-spacing-next" />
      )}
    </DotsContainer>
  )
}

const DotsContainer = styled.View({
  marginTop: getSpacing(3),
  flexDirection: 'row',
})

const ControlComponentSpacing = styled.View(({ theme }) => ({
  width: theme.controlComponent.size,
}))
