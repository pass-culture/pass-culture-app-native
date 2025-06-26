import React from 'react'
import styled from 'styled-components/native'

import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Typo } from 'ui/theme'

export const BookingPrecisions: React.FC<{
  withdrawalDetails?: string | null
  bookingContactEmail?: string | null
  onEmailPress: () => void
}> = ({ bookingContactEmail, withdrawalDetails, onEmailPress }) => (
  <ViewGap gap={6}>
    {withdrawalDetails ? (
      <ViewGap gap={4}>
        <Typo.BodyAccentS>Précisions de l’organisateur</Typo.BodyAccentS>
        <Typo.BodyS testID="withdrawalDetails">{withdrawalDetails}</Typo.BodyS>
      </ViewGap>
    ) : null}
    {bookingContactEmail ? (
      <EmailContainer gap={2}>
        <CaptionNeutralInfo numberOfLines={2}>{bookingContactEmail}</CaptionNeutralInfo>
        <ExternalTouchableLink
          as={ButtonQuaternaryBlack}
          inline
          wording="Contacter l’organisateur"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter l’organisateur"
          externalNav={{ url: `mailto:${bookingContactEmail}` }}
          icon={EmailFilled}
          onBeforeNavigate={onEmailPress}
        />
      </EmailContainer>
    ) : null}
  </ViewGap>
)

const EmailContainer = styled(ViewGap)({
  alignItems: 'flex-start',
})

const CaptionNeutralInfo = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
