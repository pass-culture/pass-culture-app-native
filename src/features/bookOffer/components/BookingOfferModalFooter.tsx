import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { Action, Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getButtonState,
  getButtonWording,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing } from 'ui/theme'

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
      dispatch({ type: 'RESET_HOUR' })
      return dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })

    case Step.HOUR:
      if (hasPricesStep) {
        dispatch({ type: 'RESET_STOCK' })
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

const FooterContainer = styled.View({
  alignItems: 'center',
  marginTop: getSpacing(6),
  marginHorizontal: getSpacing(6),
})
