import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { DuoPerson } from 'ui/svg/icons/DuoPerson'
import { Profile } from 'ui/svg/icons/Profile'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { DuoChoice } from '../atoms/DuoChoice'
import { useBooking, useBookingStock } from '../pages/BookingOfferWrapper'

export const BookDuoChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const stock = useBookingStock()

  const getChoiceInfosForQuantity = (quantity: 1 | 2) => ({
    price: stock ? formatToFrenchDecimal(quantity * stock.price).replace(' ', '') : '',
    title: quantity === 1 ? _(t`Solo`) : _(t`Duo`),
    selected: bookingState.quantity === quantity,
    icon: quantity === 1 ? Profile : DuoPerson,
    onPress: () => dispatch({ type: 'SELECT_QUANTITY', payload: quantity }),
  })

  return (
    <React.Fragment>
      <Typo.Title4 testID="DuoStep">{_(t`Nombre de place`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <DuoChoiceContainer>
        <DuoChoice {...getChoiceInfosForQuantity(1)} />
        <DuoChoice {...getChoiceInfosForQuantity(2)} />
      </DuoChoiceContainer>
    </React.Fragment>
  )
}

const DuoChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})
