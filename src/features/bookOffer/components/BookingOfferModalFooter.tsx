import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { Action, Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getButtonState,
  getButtonWording,
  resetBookingState,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

type BookingOptions = {
  hasPricesStep?: boolean
  isDuo?: boolean
}

const analyticsBySteps: { [key in Step]?: () => Promise<void> } = {
  [Step.HOUR]: analytics.logHasChosenTime,
  [Step.PRICE]: analytics.logHasChosenPrice,
  [Step.DUO]: analytics.logHasClickedDuoStep,
}

export const BookingOfferModalFooter = ({ hasPricesStep, isDuo }: BookingOptions) => {
  const { dispatch, bookingState } = useBookingContext()
  const { step } = bookingState

  // We only need those 2 informations to book an offer (and thus proceed to the next page)
  const enabledButton = getButtonState(bookingState)

  const validateOptions = useCallback(() => {
    analyticsBySteps[step]?.()

    handleBookingSteps(step, dispatch, { isDuo, hasPricesStep })
  }, [dispatch, hasPricesStep, isDuo, step])

  return step == Step.CONFIRMATION ? null : (
    <FooterContainer testID="bookingOfferModalFooter">
      <ButtonPrimary
        wording={getButtonWording(bookingState.step)}
        onPress={validateOptions}
        disabled={!enabledButton}
      />
    </FooterContainer>
  )
}

const handleBookingSteps = (
  step: Step,
  dispatch: React.Dispatch<Action>,
  { isDuo, hasPricesStep }: BookingOptions
) => {
  switch (step) {
    case Step.DATE:
      resetBookingState(dispatch)
      return dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })

    case Step.HOUR:
      if (hasPricesStep) {
        return dispatch({ type: 'CHANGE_STEP', payload: Step.PRICE })
      }
      if (isDuo) {
        return dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
      }
      return dispatch({ type: 'VALIDATE_OPTIONS' })

    case Step.PRICE:
      if (isDuo) {
        return dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
      }
      return dispatch({ type: 'VALIDATE_OPTIONS' })

    case Step.DUO:
      return dispatch({ type: 'VALIDATE_OPTIONS' })

    case Step.CONFIRMATION:
      return // handled above
  }
}

const FooterContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  marginTop: theme.designSystem.size.spacing.xl,
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))
