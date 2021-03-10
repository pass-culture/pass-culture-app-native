import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { DuoChoice } from '../atoms/DuoChoice'
import { useBooking, useBookingStock } from '../pages/BookingOfferWrapper'

export const BookDuoChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const stock = useBookingStock()

  const selectSolo = () => dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
  const selectDuo = () => dispatch({ type: 'SELECT_QUANTITY', payload: 2 })

  return (
    <React.Fragment>
      <Typo.Title4 testID="DuoStep">{_(t`Nombre de place`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <DuoChoiceContainer>
        <DuoChoice
          price={stock ? formatToFrenchDecimal(stock.price).replace(' ', '') : ''}
          quantity={1}
          selected={bookingState.quantity === 1}
          onPress={selectSolo}
        />
        <DuoChoice
          price={stock ? formatToFrenchDecimal(2 * stock.price).replace(' ', '') : ''}
          quantity={2}
          selected={bookingState.quantity === 2}
          onPress={selectDuo}
        />
      </DuoChoiceContainer>
    </React.Fragment>
  )
}

const DuoChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})
