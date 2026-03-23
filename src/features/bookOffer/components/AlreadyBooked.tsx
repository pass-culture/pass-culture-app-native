import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { env } from 'libs/environment/env'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'

export function AlreadyBooked({ offer }: { offer: OfferResponse }) {
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
      <StyledViewGap gap={designSystem.size.spacing.xs}>
        <Bold>{offer.name}</Bold>
        <StyledBody>
          Tu ne peux donc pas réserver cette offre à nouveau. Pour en savoir plus, n’hésite pas à
          consulter notre article.
        </StyledBody>
      </StyledViewGap>
      <ExternalLink
        text="Pourquoi limiter les réservations&nbsp;?"
        url={env.BOOKING_LIMIT_EXCEEDED_URL}
        primary
      />
      <TouchableContainer>
        <InternalTouchableLink
          as={Button}
          wording="Mes réservations terminées"
          navigateTo={{ screen: 'Bookings' }}
          onBeforeNavigate={dismissModal}
          fullWidth
        />
      </TouchableContainer>
    </Container>
  )
}

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
  alignItems: 'center',
}))

const TouchableContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxxxl,
  width: '100%',
}))
const Container = styled.View({
  alignItems: 'center',
})

const Bold = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
