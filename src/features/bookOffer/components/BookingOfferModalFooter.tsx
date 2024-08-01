import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getButtonState,
  getButtonWording,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing } from 'ui/theme'

type Props = {
  hasPricesStep?: boolean
  isDuo?: boolean
}

export const BookingOfferModalFooter = ({ hasPricesStep, isDuo }: Props) => {
  const { dispatch, bookingState } = useBookingContext()
  const { step } = bookingState

  // We only need those 2 informations to book an offer (and thus proceed to the next page)
  const enabledButton = getButtonState(bookingState)

  const validateOptions = useCallback(() => {
    if (step === Step.DATE) {
      dispatch({ type: 'RESET_HOUR' })
      return dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
    }

    if (step === Step.HOUR && hasPricesStep) {
      analytics.logHasChosenTime()
      dispatch({ type: 'RESET_STOCK' })
      return dispatch({ type: 'CHANGE_STEP', payload: Step.PRICE })
    }

    if (step === Step.PRICE) analytics.logHasChosenPrice()

    if (isDuo && ((step === Step.HOUR && !hasPricesStep) || step === Step.PRICE)) {
      if (step === Step.HOUR) analytics.logHasChosenTime()
      return dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
    }

    if (step === Step.DUO) analytics.logHasClickedDuoStep()

    return dispatch({ type: 'VALIDATE_OPTIONS' })
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

const FooterContainer = styled.View({
  alignItems: 'center',
  marginTop: getSpacing(6),
  marginHorizontal: getSpacing(6),
})
