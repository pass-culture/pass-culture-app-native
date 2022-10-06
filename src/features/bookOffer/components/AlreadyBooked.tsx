import React from 'react'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { Spacer } from 'ui/components/spacer/Spacer'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing, Typo } from 'ui/theme'

export function AlreadyBooked({ offer }: { offer: OfferResponse }) {
  const { dismissModal } = useBooking()

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
        testID="external-link-booking-limit-exceeded"
      />
      <Spacer.Column numberOfSpaces={getSpacing(3)} />
      <TouchableLink
        as={ButtonPrimary}
        wording="Mes réservations terminées"
        navigateTo={{ screen: 'EndedBookings' }}
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
