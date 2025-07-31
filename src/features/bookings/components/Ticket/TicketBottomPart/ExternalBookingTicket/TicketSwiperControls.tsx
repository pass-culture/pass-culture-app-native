import React from 'react'
import styled from 'styled-components/native'

import { ControlComponent } from 'features/bookings/components/OldBookingDetails/Ticket/ControlComponent'
import { StepDots } from 'ui/components/StepDots'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

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
    <DotsContainer gap={2} testID="swiper-tickets-controls">
      {showPrevButton ? (
        <ControlComponent type="prev" title={prevTitle} onPress={onPressPrev} />
      ) : (
        <ControlComponentSpacing testID="control-component-spacing-prev" />
      )}
      <StepDots
        numberOfSteps={numberOfSteps}
        currentStep={currentStep}
        withNeutralPreviousStepsColor
      />
      {showNextButton ? (
        <ControlComponent type="next" title={nextTitle} onPress={onPressNext} />
      ) : (
        <ControlComponentSpacing testID="control-component-spacing-next" />
      )}
    </DotsContainer>
  )
}

const DotsContainer = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.m,
  flexDirection: 'row',
}))

const ControlComponentSpacing = styled.View(({ theme }) => ({
  width: theme.controlComponent.size,
}))
