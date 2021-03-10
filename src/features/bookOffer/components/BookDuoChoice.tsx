import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { _ } from 'libs/i18n'
import { Check } from 'ui/svg/icons/Check'
import { Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { useBooking, useBookingOffer } from '../pages/BookingOfferWrapper'

export const BookDuoChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const offer = useBookingOffer()

  const selectSolo = () => dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
  const selectDuo = () => dispatch({ type: 'SELECT_QUANTITY', payload: 2 })

  return (
    <React.Fragment>
      <Typo.Title4 testID="DuoStep">{_(t`Nombre de place`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={selectSolo}>
        <Typo.ButtonText>
          {_(t`Solo`)}
          {bookingState.quantity === 1 && <Check />}
        </Typo.ButtonText>
      </TouchableOpacity>
      {offer?.isDuo && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={selectDuo}>
            <Typo.ButtonText>
              {_(t`Duo`)}
              {bookingState.quantity === 2 && <Check />}
            </Typo.ButtonText>
          </TouchableOpacity>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
