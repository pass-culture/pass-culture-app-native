import { t } from '@lingui/macro'
import debounce from 'lodash/debounce'
import React, { useMemo, useRef } from 'react'
import styled from 'styled-components/native'

import { HourChoice } from 'features/bookOffer/atoms/HourChoice'
import {
  useBooking,
  useBookingOffer,
  useBookingStock,
} from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { formatHour, formatToKeyDate } from 'features/bookOffer/services/utils'
import { useCreditForOffer } from 'features/offer/services/useHasEnoughCredit'
import { Typo, Spacer, getSpacing } from 'ui/theme'

export const BookHourChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const { isDuo, stocks = [] } = useBookingOffer() || {}
  const bookingStock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const debouncedDispatch = useRef(debounce(dispatch, 300)).current

  const selectedDate = bookingState.date ? formatToKeyDate(bookingState.date) : undefined
  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (isDuo) {
      if (bookingState.quantity) {
        debouncedDispatch({ type: 'CHANGE_STEP', payload: Step.PRE_VALIDATION })
      } else {
        debouncedDispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
      }
    } else {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const changeHour = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.HOUR })
  }

  const filteredStocks = useMemo(
    () =>
      stocks
        .filter(({ beginningDatetime }) => {
          if (beginningDatetime === undefined || beginningDatetime === null) return false
          return selectedDate && beginningDatetime
            ? formatToKeyDate(beginningDatetime) === selectedDate
            : false
        })
        .sort(
          (a, b) =>
            //@ts-expect-error : stocks with no beginningDatetime was filtered
            new Date(a.beginningDatetime).getTime() - new Date(b.beginningDatetime).getTime()
        )
        .map((stock) => (
          <HourChoice
            key={stock.id}
            price={stock.price}
            hour={formatHour(stock.beginningDatetime).replace(':', 'h')}
            selected={stock.id === bookingState.stockId}
            onPress={() => selectStock(stock.id)}
            testID={`HourChoice${stock.id}`}
            isBookable={stock.isBookable}
            offerCredit={offerCredit}
          />
        )),
    [stocks, selectedDate, bookingState.stockId, bookingState.quantity, offerCredit]
  )

  return (
    <React.Fragment>
      <Typo.Title4 testID="HourStep">{t`Heure`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      {bookingState.step === Step.HOUR ? (
        <HourChoiceContainer>{filteredStocks}</HourChoiceContainer>
      ) : (
        <TouchableOpacity onPress={changeHour}>
          <Typo.ButtonText>
            {bookingStock && bookingStock.beginningDatetime
              ? formatHour(bookingStock.beginningDatetime)
              : ''}
          </Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``

const HourChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})
