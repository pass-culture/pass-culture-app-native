import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useOffer } from 'features/offer/api/useOffer'
import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { useBooking } from '../pages/BookingOfferWrapper'

export const BookDuoChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const { data: offer } = useOffer({ offerId: bookingState.offerId || 0 })

  const toggleQuantity = () => {
    dispatch({ type: 'SELECT_QUANTITY', payload: bookingState.quantity === 1 ? 2 : 1 })
  }

  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Nombre de place`)}</Typo.Title4>
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        onPress={toggleQuantity}
        disabled={!offer?.isDuo}>
        <Typo.ButtonText>{bookingState.quantity === 1 ? _(t`Solo`) : _(t`Duo`)}</Typo.ButtonText>
      </TouchableOpacity>
    </React.Fragment>
  )
}
