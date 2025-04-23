import React from 'react'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookDateChoice } from 'features/bookOffer/components/BookDateChoice'
import { BookDuoChoice } from 'features/bookOffer/components/BookDuoChoice'
import { BookHourChoice } from 'features/bookOffer/components/BookHourChoice'
import { BookPricesChoice } from 'features/bookOffer/components/BookPricesChoice'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getStockWithCategory } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  stocks: OfferStockResponse[]
  offerIsDuo?: boolean
}

export const BookingEventChoices: React.FC<Props> = ({ stocks, offerIsDuo }) => {
  const { bookingState } = useBookingContext()
  const { user } = useAuthContext()
  const creditForOffer = useCreditForOffer(bookingState.offerId)
  const { step } = bookingState

  const stocksWithCategory = getStockWithCategory(stocks)

  if (!user) return null

  const shouldDisplayDateSelection = step === Step.DATE
  const shouldDisplayHourSelection = step === Step.HOUR
  const shouldDisplayPriceSelection = step === Step.PRICE

  return (
    <Container>
      {shouldDisplayDateSelection ? (
        <BookDateChoice stocks={stocks} userRemainingCredit={creditForOffer} />
      ) : null}

      {step && step >= Step.HOUR ? (
        <React.Fragment>
          {shouldDisplayHourSelection ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <BookHourChoice />
              <Spacer.Column numberOfSpaces={6} />
            </React.Fragment>
          ) : null}
        </React.Fragment>
      ) : null}
      {step && step >= Step.PRICE ? (
        <React.Fragment>
          {shouldDisplayPriceSelection ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <BookPricesChoice stocks={stocksWithCategory} isDuo={offerIsDuo} />
              <Spacer.Column numberOfSpaces={6} />
            </React.Fragment>
          ) : null}
        </React.Fragment>
      ) : null}
      {step && step >= Step.DUO ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <BookDuoChoice />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(2) })
