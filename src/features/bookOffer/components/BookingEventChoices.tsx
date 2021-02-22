import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { BookDateChoice } from 'features/bookOffer/components/BookDateChoice'
import { BookDuoChoice } from 'features/bookOffer/components/BookDuoChoice'
import { BookHourChoice } from 'features/bookOffer/components/BookHourChoice'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

interface Props {
  dismissModal: () => void
}

export const BookingEventChoices: React.FC<Props> = ({ dismissModal }) => {
  const { bookingState, dispatch } = useBooking()

  const validateOptions = () => {
    dispatch({ type: 'VALIDATE_OPTIONS' })
  }

  if (bookingState.step === Step.CONFIRMATION) {
    return <BookingDetails dismissModal={dismissModal} />
  }

  return (
    <Container>
      <BookDateChoice />

      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />

      <BookHourChoice />

      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />

      <BookDuoChoice />

      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary title={_(t`Valider ces options`)} onPress={validateOptions} />
    </Container>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(12) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
})
