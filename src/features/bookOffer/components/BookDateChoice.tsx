import React, { useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { Calendar } from 'features/bookOffer/components/Calendar/Calendar'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getDistinctPricesFromAllStock } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Spacer, Typo, TypoDS, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  stocks: OfferStockResponse[]
  userRemainingCredit: number | null
}

export const BookDateChoice = ({ stocks, userRemainingCredit }: Props) => {
  const { bookingState, dispatch } = useBookingContext()
  const hasSeveralPrices = useMemo(() => {
    const distinctPrices = getDistinctPricesFromAllStock(stocks)
    return distinctPrices.length > 1
  }, [stocks])

  const showCalendar = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.DATE })
    dispatch({ type: 'RESET_QUANTITY' })
    dispatch({ type: 'RESET_STOCK' })
  }

  const buttonTitle = bookingState.date ? formatToCompleteFrenchDate(bookingState.date) : ''

  return (
    <StyledView>
      <TypoDS.Title3 {...getHeadingAttrs(3)} testID="DateStep">
        Date
      </TypoDS.Title3>

      {bookingState.step === Step.DATE ? (
        <Calendar
          stocks={stocks}
          userRemainingCredit={userRemainingCredit}
          offerId={bookingState.offerId}
          hasSeveralPrices={hasSeveralPrices}
        />
      ) : (
        <TouchableOpacity onPress={showCalendar}>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.ButtonText>{buttonTitle}</Typo.ButtonText>
        </TouchableOpacity>
      )}
    </StyledView>
  )
}

const StyledView = styled(View)({
  marginTop: getSpacing(6),
})
