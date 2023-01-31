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
}

export const BookDateChoice: React.FC<Props> = ({ stocks, userRemainingCredit }) => {
  const { bookingState, dispatch } = useBookingContext()

  const showCalendar = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.DATE })
    dispatch({ type: 'RESET_QUANTITY' })
    dispatch({ type: 'RESET_STOCK' })
  }

  const buttonTitle = bookingState.date ? formatToCompleteFrenchDate(bookingState.date) : ''

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Title4 {...getHeadingAttrs(2)} testID="DateStep">
        Date
      </Typo.Title4>
      {bookingState.step === Step.DATE ? (
        <Calendar
          stocks={stocks}
          userRemainingCredit={userRemainingCredit}
          offerId={bookingState.offerId}
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
