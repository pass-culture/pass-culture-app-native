import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { env } from 'libs/environment/env'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { Spacer } from 'ui/components/spacer/Spacer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Typo } from 'ui/theme'

export function AlreadyBooked({ offer }: { offer: OfferResponseV2 }) {
  const { bookingState, dismissModal, dispatch } = useBookingContext()
  const { designSystem } = useTheme()
  // Change step to confirmation
  useEffect(() => {
    if (bookingState.step === Step.DATE) {
      dispatch({ type: 'CHANGE_STEP', payload: Step.CONFIRMATION })
    }
  }, [bookingState.step, dispatch])

  return (
    <Container>
      <StyledBody>Tu as déjà réservé&nbsp;:</StyledBody>
      <Bold>{offer.name}</Bold>
      <Spacer.Column numberOfSpaces={getSpacing(1)} />
      <StyledBody>
        Tu ne peux donc pas réserver cette offre à nouveau. Pour en savoir plus, n’hésite pas à
        consulter notre article.
      </StyledBody>
      <Spacer.Column numberOfSpaces={getSpacing(1)} />
      <ExternalLink
        text="Pourquoi limiter les réservations&nbsp;?"
        url={env.BOOKING_LIMIT_EXCEEDED_URL}
        primary
      />
      <Spacer.Column numberOfSpaces={designSystem.size.spacing.m} />
      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Mes réservations terminées"
        navigateTo={{ screen: 'Bookings' }}
        onBeforeNavigate={dismissModal}
      />
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const Bold = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
