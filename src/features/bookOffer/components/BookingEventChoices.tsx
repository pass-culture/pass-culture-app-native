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
import { useCreditForOffer } from 'features/offer/services/useHasEnoughCredit'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  stocks: OfferStockResponse[]
}

export const BookingEventChoices: React.FC<Props> = ({ stocks }) => {
  const { bookingState, dispatch } = useBooking()
  const { data: user } = useUserProfileInfo()
  const creditForOffer = useCreditForOffer(bookingState.offerId)
  const { step, quantity, stockId } = bookingState

  if (!user) return <React.Fragment />

  const validateOptions = () => dispatch({ type: 'VALIDATE_OPTIONS' })

  if (bookingState.step === Step.CONFIRMATION) {
    return <BookingDetails stocks={stocks} />
  }

  // We only need those 2 informations to book an offer (and thus proceed to the next page)
  const enabled = typeof stockId === 'number' && typeof quantity === 'number'

  return (
    <Container>
      <Separator />
      <BookDateChoice stocks={stocks} userRemainingCredit={creditForOffer} />

      <Spacer.Column numberOfSpaces={6} />
      {!!(step && step >= Step.HOUR) && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <BookHourChoice />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      {!!(step && step >= Step.DUO) && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <BookDuoChoice />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      <ButtonPrimary
        wording={enabled ? t`Valider ces options` : t`Choisir les options`}
        onPress={validateOptions}
        disabled={!enabled}
      />
    </Container>
  )
}

const Container = styled.View({ width: '100%', marginTop: -getSpacing(2) })
const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))
