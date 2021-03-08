import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'

import { useBooking, useBookingOffer } from 'features/bookOffer/pages/BookingOfferWrapper'
import { formatHour, formatToKeyDate } from 'features/bookOffer/services/utils'
import { _ } from 'libs/i18n'
import { Typo, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { Step } from '../pages/reducer'

export const BookHourChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const offer = useBookingOffer()

  const { stocks = [] } = useBookingOffer() || {}
  const selectedDate = bookingState.date ? formatToKeyDate(bookingState.date) : undefined

  const selectStock = (stockId: number) => {
    dispatch({ type: 'SELECT_STOCK', payload: stockId })
    if (offer?.isDuo) dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
  }

  const filteredStocks = stocks.filter(({ beginningDatetime }) =>
    selectedDate && beginningDatetime ? formatToKeyDate(beginningDatetime) === selectedDate : false
  )

  useEffect(() => {
    if (filteredStocks.length === 1) selectStock(filteredStocks[0].id)
  }, [filteredStocks.length])

  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Heure`)}</Typo.Title4>
      {filteredStocks.map((stock) => (
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          key={stock.id}
          onPress={() => selectStock(stock.id)}>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.ButtonText>{formatHour(stock.beginningDatetime)}</Typo.ButtonText>
        </TouchableOpacity>
      ))}
    </React.Fragment>
  )
}
