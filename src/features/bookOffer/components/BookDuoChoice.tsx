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

  const SINGLE_QUANTITY = 1
  const DUO_QUANTITY = 2
  return (
    <React.Fragment>
      <Typo.Title4 testID="DuoStep">{_(t`Nombre de place`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <DuoChoiceContainer>
        <DuoChoice
          price={stock ? formatToFrenchDecimal(SINGLE_QUANTITY * stock.price).replace(' ', '') : ''}
          quantity={SINGLE_QUANTITY}
          selected={bookingState.quantity === SINGLE_QUANTITY}
          onPress={selectSolo}
        />
        <DuoChoice
          price={stock ? formatToFrenchDecimal(DUO_QUANTITY * stock.price).replace(' ', '') : ''}
          quantity={DUO_QUANTITY}
          selected={bookingState.quantity === DUO_QUANTITY}
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
