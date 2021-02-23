import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'

import { useBooking } from '../pages/BookingOfferWrapper'

export const BookDuoChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()

  const toggleQuantity = () => {
    dispatch({ type: 'SELECT_QUANTITY', payload: bookingState.quantity === 1 ? 2 : 1 })
  }

  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Nombre de place`)}</Typo.Title4>
      <Typo.ButtonText onPress={toggleQuantity}>
        {bookingState.quantity === 1 ? _(t`Solo`) : _(t`Duo`)}
      </Typo.ButtonText>
    </React.Fragment>
  )
}
