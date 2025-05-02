import React from 'react'
import styled from 'styled-components/native'

import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Typo, getSpacing } from 'ui/theme'

export const BookingPrecisions: React.FC<{
  withdrawalDetails?: string | null
  bookingContactEmail?: string | null
  onEmailPress: () => void
}> = ({ bookingContactEmail, withdrawalDetails, onEmailPress }) => (
  <Container>
    {withdrawalDetails ? (
      <ViewGap gap={4}>
        <Typo.BodyAccentS>Précisions de l’organisateur</Typo.BodyAccentS>
        <Typo.BodyS testID="withdrawalDetails">{withdrawalDetails}</Typo.BodyS>
      </ViewGap>
    ) : null}
    {bookingContactEmail ? (
      <ViewGap gap={2}>
        <CaptionNeutralInfo>
          Pour toute question à propos de ta réservation, contacte l’organisateur.
        </CaptionNeutralInfo>
        <ExternalTouchableLink
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter l’organisateur"
          externalNav={{ url: `mailto:${bookingContactEmail}` }}
          onBeforeNavigate={onEmailPress}>
          <EmailContainer gap={2}>
            <StyledEmailFilled />
            <Typo.Button numberOfLines={2}>{bookingContactEmail}</Typo.Button>
          </EmailContainer>
        </ExternalTouchableLink>
      </ViewGap>
    ) : null}
  </Container>
)

const EmailContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledEmailFilled = styled(EmailFilled)({
  width: getSpacing(5),
})

const Container = styled.View({
  marginHorizontal: getSpacing(6),
  gap: getSpacing(6),
})

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
