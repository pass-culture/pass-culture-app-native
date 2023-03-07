import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import {
  getButtonState,
  getButtonWording,
} from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
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
      return dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
    }
    if (step === Step.HOUR && hasPricesStep) {
      return dispatch({ type: 'CHANGE_STEP', payload: Step.PRICE })
    }
    if (isDuo && ((step === Step.HOUR && !hasPricesStep) || step === Step.PRICE)) {
      return dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
    }

    return dispatch({ type: 'VALIDATE_OPTIONS' })
  }, [dispatch, hasPricesStep, isDuo, step])

  return step < Step.CONFIRMATION ? (
    <FooterContainer testID="bookingOfferModalFooter">
      <ButtonPrimary
        wording={getButtonWording(true, enabledButton, bookingState.step)}
        onPress={validateOptions}
        disabled={!enabledButton}
      />
    </FooterContainer>
  ) : (
    <React.Fragment />
  )
}

const FooterContainer = styled.View({
  alignItems: 'center',
  marginTop: getSpacing(6),
  marginHorizontal: getSpacing(6),
})
