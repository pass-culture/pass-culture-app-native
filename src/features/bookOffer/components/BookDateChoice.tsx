import React from 'react'

import { OfferStockResponse } from 'api/gen'
import { Calendar } from 'features/bookOffer/components/Calendar/Calendar'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  stocks: OfferStockResponse[]
  userRemainingCredit: number | null
  enablePricesByCategories?: boolean
}

export const BookDateChoice = ({
  stocks,
  userRemainingCredit,
  enablePricesByCategories,
}: Props) => {
  const { bookingState, dispatch } = useBookingContext()
  const hasPricesStep =
    enablePricesByCategories && stocks.filter((stock) => !stock.isExpired).length > 1

  const showCalendar = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.DATE })
    dispatch({ type: 'RESET_QUANTITY' })
    dispatch({ type: 'RESET_STOCK' })
  }

  const buttonTitle = bookingState.date ? formatToCompleteFrenchDate(bookingState.date) : ''

  return (
    <React.Fragment>
      {enablePricesByCategories ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <Typo.Title3 {...getHeadingAttrs(3)} testID="DateStep">
            Date
          </Typo.Title3>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Title4 {...getHeadingAttrs(2)} testID="DateStep">
            Date
          </Typo.Title4>
        </React.Fragment>
      )}

      {bookingState.step === Step.DATE ? (
        <Calendar
          stocks={stocks}
          userRemainingCredit={userRemainingCredit}
          offerId={bookingState.offerId}
          enablePricesByCategories={enablePricesByCategories}
          hasSeveralPrices={hasPricesStep}
        />
      ) : (
        <TouchableOpacity onPress={showCalendar}>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.ButtonText>{buttonTitle}</Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}
