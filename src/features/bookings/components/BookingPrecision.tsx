import React from 'react'
import styled from 'styled-components/native'

import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
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
      <ExplanationContainer>
        <Typo.BodyAccentS>Précisions de l’organisateur</Typo.BodyAccentS>
        <Typo.BodyS testID="withdrawalDetails">{withdrawalDetails}</Typo.BodyS>
      </ExplanationContainer>
    ) : null}
    {bookingContactEmail ? (
      <ViewGap gap={2}>
        <CaptionNeutralInfo>
          Pour toute question à propos de ta réservation, contacte l’organisateur.
        </CaptionNeutralInfo>
        <SendEmailContainer>
          <ExternalTouchableLink
            as={ButtonTertiaryBlack}
            inline
            wording={bookingContactEmail}
            accessibilityLabel="Ouvrir le gestionnaire mail pour contacter l’organisateur"
            externalNav={{ url: `mailto:${bookingContactEmail}` }}
            icon={EmailFilled}
            onBeforeNavigate={onEmailPress}
          />
        </SendEmailContainer>
      </ViewGap>
    ) : null}
  </Container>
)

const SendEmailContainer = styled.View({
  alignItems: 'flex-start',
})

const Container = styled.View({ marginHorizontal: getSpacing(6), gap: getSpacing(6) })

const ExplanationContainer = styled.View({ gap: getSpacing(4) })

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
