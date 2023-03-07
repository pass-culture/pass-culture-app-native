import React from 'react'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { BookDateChoice } from 'features/bookOffer/components/BookDateChoice'
import { BookDuoChoice } from 'features/bookOffer/components/BookDuoChoice'
import { BookHourChoice } from 'features/bookOffer/components/BookHourChoice'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookPricesChoice } from 'features/bookOffer/components/BookPricesChoice'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getButtonWording } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  stocks: OfferStockResponse[]
  enablePricesByCategories: boolean
  offerIsDuo?: boolean
}

export const BookingEventChoices: React.FC<Props> = ({
  stocks,
  enablePricesByCategories,
  offerIsDuo,
}) => {
  const { bookingState, dispatch } = useBookingContext()
  const { user } = useAuthContext()
  const creditForOffer = useCreditForOffer(bookingState.offerId)
  const { step, quantity, stockId } = bookingState

  const stocksWithCategory = stocks.filter((stock) => stock.priceCategoryLabel)

  if (!user) return <React.Fragment />

  const validateOptions = () => {
    dispatch({ type: 'VALIDATE_OPTIONS' })
  }

  if (bookingState.step === Step.CONFIRMATION) {
    return <BookingDetails stocks={stocks} />
  }

  const getButtonState = () => {
    return typeof stockId === 'number' && typeof quantity === 'number'
  }

  // We only need those 2 informations to book an offer (and thus proceed to the next page)
  const enabled = getButtonState()

  const shouldDisplayDateSelection =
    (step === Step.DATE && enablePricesByCategories) || !enablePricesByCategories
  const shouldDisplayHourSelection =
    (step === Step.HOUR && enablePricesByCategories) || !enablePricesByCategories
  const shouldDisplayPriceSelection = step === Step.PRICE && enablePricesByCategories

  return (
    <Container>
      {!enablePricesByCategories && <Separator />}
      {!!shouldDisplayDateSelection && (
        <BookDateChoice
          stocks={stocks}
          userRemainingCredit={creditForOffer}
          enablePricesByCategories={enablePricesByCategories}
        />
      )}

      {!enablePricesByCategories && <Spacer.Column numberOfSpaces={6} />}

      {!!(step && step >= Step.HOUR) && (
        <React.Fragment>
          {!enablePricesByCategories && <Separator />}

          {!!shouldDisplayHourSelection && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <BookHourChoice enablePricesByCategories={enablePricesByCategories} />

              <Spacer.Column numberOfSpaces={6} />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {!!(step && step >= Step.PRICE) && (
        <React.Fragment>
          {!!shouldDisplayPriceSelection && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <BookPricesChoice stocks={stocksWithCategory} isDuo={offerIsDuo} />

              <Spacer.Column numberOfSpaces={6} />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {!!(step && step >= Step.DUO) && (
        <React.Fragment>
          {!enablePricesByCategories && <Separator />}
          <Spacer.Column numberOfSpaces={6} />

          <BookDuoChoice enablePricesByCategories={enablePricesByCategories} />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      {!enablePricesByCategories && (
        <ButtonPrimary
          wording={getButtonWording(enablePricesByCategories, enabled, step)}
          onPress={validateOptions}
          disabled={!enabled}
          testID="modalButtonWithoutEnabledPricesByCategories"
        />
      )}
    </Container>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(2) })
const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))
