import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Calendar } from 'features/bookOffer/components/Calendar/Calendar'
import { getDistinctPricesFromAllStock } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { formatToKeyDate, parseBookingKeyDate } from 'features/bookOffer/helpers/utils'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type Props = {
  offerId: number
  selectedDate?: string
  onSelectDate: (date: string) => void
}

export const BookingDateStep: React.FC<Props> = ({ offerId, selectedDate, onSelectDate }) => {
  const { data: offer } = useOfferQuery({ offerId })
  const userRemainingCredit = useCreditForOffer(offerId)
  const stocks = offer?.stocks ?? []
  const hasSeveralPrices = getDistinctPricesFromAllStock(stocks).length > 1

  if (!offer) return null

  return (
    <StyledView testID="BookingDateStep">
      <Typo.Title3 {...setTextSemantic('h3')}>Date</Typo.Title3>
      <Calendar
        stocks={stocks}
        userRemainingCredit={userRemainingCredit}
        offerId={offerId}
        hasSeveralPrices={hasSeveralPrices}
        selectedDate={selectedDate ? parseBookingKeyDate(selectedDate) : null}
        onSelectDate={(date) => onSelectDate(formatToKeyDate(date))}
      />
    </StyledView>
  )
}

const StyledView = styled(View)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
