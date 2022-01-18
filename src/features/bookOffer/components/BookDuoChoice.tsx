import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { Spacer, Typo } from 'ui/theme'

export const BookDuoChoice: React.FC = () => {
  const { bookingState, dispatch } = useBooking()

  const updateBookingStepToDuo = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
  }

  return (
    <React.Fragment>
      <Typo.Title4 testID="DuoStep">{t`Nombre de place`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      {bookingState.step === Step.DUO ? (
        <DuoChoiceSelector />
      ) : (
        <TouchableOpacity onPress={updateBookingStepToDuo}>
          <Typo.ButtonText>
            {bookingState.quantity && bookingState.quantity === 1 ? t`Solo` : t`Duo`}
          </Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``
