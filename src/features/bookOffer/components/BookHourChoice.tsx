import { t } from '@lingui/macro'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { useBooking, useBookingOffer } from 'features/bookOffer/pages/BookingOfferWrapper'
import { _ } from 'libs/i18n'
import { Typo, Spacer } from 'ui/theme'

import { Step } from '../pages/reducer'

export const BookHourChoice: React.FC = () => {
  const { dispatch } = useBooking()
  const offer = useBookingOffer()

  const goToNextStep = () => {
    //TODO 6705: add dispatch hour choice in state
    if (offer?.isDuo) dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
  }

  return (
    <React.Fragment>
      <Typo.Title4 testID="HourStep">{_(t`Heure`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.ButtonText>{_(t`21:00`)}</Typo.ButtonText>
      <TouchableOpacity onPress={goToNextStep}>
        {/* TODO 6705: Remove this line */}
        <Text>Simuler choix horaire</Text>
      </TouchableOpacity>
    </React.Fragment>
  )
}
