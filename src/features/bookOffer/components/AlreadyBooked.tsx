import { t } from '@lingui/macro'
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
      <Centered>{t`Tu as déjà réservé\u00a0:`}</Centered>
      <Bold>{offer.name}</Bold>
      <Spacer.Column numberOfSpaces={getSpacing(1)} />
      <Centered>
        {t`Tu ne peux donc pas réserver cette offre à nouveau. Pour en savoir plus, n'hésite pas à consulter notre article.`}
      </Centered>
      <Spacer.Column numberOfSpaces={getSpacing(1)} />
      <ExternalLink
        text={t`Pourquoi limiter les réservations\u00a0?`}
        url={env.BOOKING_LIMIT_EXCEEDED_URL}
        primary
        testID="external-link-booking-limit-exceeded"
      />
      <Spacer.Column numberOfSpaces={getSpacing(3)} />
      <TouchableLink
        as={ButtonPrimary}
        wording={t`Mes réservations terminées`}
        navigateTo={{ screen: 'EndedBookings' }}
        onPress={dismissModal}
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

const Centered = styled(Typo.Body)({
  textAlign: 'center',
})
