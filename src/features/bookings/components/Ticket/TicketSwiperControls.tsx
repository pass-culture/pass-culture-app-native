import React from 'react'
import styled from 'styled-components/native'

import { ControlComponent } from 'features/bookings/components/Ticket/ControlComponent'
import { StepDots } from 'ui/components/StepDots'
import { getSpacing } from 'ui/theme'

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
      <StepDotsContainer>
        <StepDots
          numberOfSteps={numberOfSteps}
          currentStep={currentStep}
          withNeutralPreviousStepsColor
        />
      </StepDotsContainer>
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

const StepDotsContainer = styled.View({ marginHorizontal: getSpacing(2) })
