import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { BookDateChoice } from 'features/bookOffer/components/BookDateChoice'
import { BookDuoChoice } from 'features/bookOffer/components/BookDuoChoice'
import { BookHourChoice } from 'features/bookOffer/components/BookHourChoice'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { useUserProfileInfo } from 'features/home/api'
import { useAvailableCredit } from 'features/home/services/useAvailableCredit'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

interface Props {
  stocks: OfferStockResponse[]
}

export const BookingEventChoices: React.FC<Props> = ({ stocks }) => {
  const { bookingState, dispatch } = useBooking()
  const { data: user } = useUserProfileInfo()
  const remainingCredit = useAvailableCredit()
  const { step, quantity } = bookingState

  if (!user) return <React.Fragment />

  const validateOptions = () => {
    dispatch({ type: 'VALIDATE_OPTIONS' })
  }

  if (bookingState.step === Step.CONFIRMATION) {
    return <BookingDetails />
  }

  return (
    <Container>
      <Separator />
      <BookDateChoice
        stocks={stocks}
        userRemainingCredit={remainingCredit ? remainingCredit.amount : null}
      />

      <Spacer.Column numberOfSpaces={6} />
      {bookingState.step && bookingState.step >= Step.HOUR && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <BookHourChoice />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      {bookingState.step && bookingState.step >= Step.DUO && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <BookDuoChoice />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      <ButtonPrimary title={_(t`Valider ces options`)} onPress={validateOptions} />
      <Spacer.Column numberOfSpaces={4} />
    </Container>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(2) })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
})
