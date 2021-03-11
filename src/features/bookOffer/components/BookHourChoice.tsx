import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useBooking, useBookingOffer } from 'features/bookOffer/pages/BookingOfferWrapper'
import { formatHour, formatToKeyDate } from 'features/bookOffer/services/utils'
import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Typo, Spacer, getSpacing } from 'ui/theme'

import { HourChoice } from '../atoms/HourChoice'
import { Step } from '../pages/reducer'

export const BookHourChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const { isDuo, stocks = [] } = useBookingOffer() || {}

  const selectedDate = bookingState.date ? formatToKeyDate(bookingState.date) : undefined

  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (isDuo) {
      dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
    } else {
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }

  const filteredStocks = stocks.filter(({ beginningDatetime }) =>
    selectedDate && beginningDatetime ? formatToKeyDate(beginningDatetime) === selectedDate : false
  )

  return (
    <React.Fragment>
      <Typo.Title4 testID="HourStep">{_(t`Heure`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <HourChoiceContainer>
        {filteredStocks.map((stock) => {
          return (
            <HourChoice
              key={stock.id}
              price={formatToFrenchDecimal(stock.price).replace(' ', '')}
              hour={formatHour(stock.beginningDatetime).replace(':', 'h')}
              selected={stock.id === bookingState.stockId}
              onPress={() => selectStock(stock.id)}
              testID={`HourChoice${stock.id}`}
            />
          )
        })}
      </HourChoiceContainer>
    </React.Fragment>
  )
}

const HourChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})
