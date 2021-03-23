import { t } from '@lingui/macro'
import { debounce } from 'lodash'
import React, { useMemo, useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import {
  useBooking,
  useBookingOffer,
  useBookingStock,
} from 'features/bookOffer/pages/BookingOfferWrapper'
import { formatHour, formatToKeyDate } from 'features/bookOffer/services/utils'
import { useCreditForOffer } from 'features/offer/services/useHasEnoughCredit'
import { _ } from 'libs/i18n'
import { Typo, Spacer, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { HourChoice } from '../atoms/HourChoice'
import { Step } from '../pages/reducer'

export const BookHourChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const { isDuo, stocks = [] } = useBookingOffer() || {}
  const stock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId || 0)
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
            //@ts-ignore : stocks with no beginningDatetime was filtered
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
      <Typo.Title4 testID="HourStep">{_(t`Heure`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      {bookingState.step === Step.HOUR ? (
        <HourChoiceContainer>{filteredStocks}</HourChoiceContainer>
      ) : (
        <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={changeHour}>
          <Typo.ButtonText>
            {stock && stock.beginningDatetime ? formatHour(stock.beginningDatetime) : ''}
          </Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}

const HourChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})
