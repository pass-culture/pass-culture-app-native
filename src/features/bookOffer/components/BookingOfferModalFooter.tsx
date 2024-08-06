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

const doBeforeValidate = (aStep: Step) => {
  switch (aStep) {
    case Step.HOUR:
      analytics.logHasChosenTime()
      break

    case Step.PRICE:
      analytics.logHasChosenPrice()
      break

    case Step.DUO:
      analytics.logHasClickedDuoStep()
      break
  }
}

export const BookingOfferModalFooter = ({ hasPricesStep, isDuo }: Props) => {
  const { dispatch, bookingState } = useBookingContext()
  const { step } = bookingState

  // We only need those 2 informations to book an offer (and thus proceed to the next page)
  const enabledButton = getButtonState(bookingState)

  const validateOptions = useCallback(() => {
    doBeforeValidate(step)
    switch (step) {
      case Step.DATE:
        dispatch({ type: 'RESET_HOUR' })
        dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
        break

      case Step.HOUR:
        if (hasPricesStep) {
          dispatch({ type: 'RESET_STOCK' })
          dispatch({ type: 'CHANGE_STEP', payload: Step.PRICE })
        } else if (isDuo) {
          dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
        } else {
          dispatch({ type: 'VALIDATE_OPTIONS' })
        }
        break

      case Step.PRICE:
        if (isDuo) {
          dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
        } else {
          dispatch({ type: 'VALIDATE_OPTIONS' })
        }
        break

      case Step.DUO:
        dispatch({ type: 'VALIDATE_OPTIONS' })
        break

      default:
        dispatch({ type: 'VALIDATE_OPTIONS' })
        break
    }
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
