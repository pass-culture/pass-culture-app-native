import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { useVenue } from 'features/venue/api/useVenue'
import { analytics } from 'libs/firebase/analytics'
import { isValidFrenchPhoneNumber, openPhoneNumber, openMail } from 'ui/components/contact/helpers'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PhoneFilled } from 'ui/svg/icons/PhoneFilled'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const ContactBlock: React.FC<{ venueId: number }> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)
  const { email, phoneNumber, website } = venue?.contact || {}

  const onPressMail = useCallback(() => {
    if (!email) return
    analytics.logVenueContact({ type: 'email', venueId })
    openMail(email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const onPressPhone = useCallback(() => {
    if (!phoneNumber) return
    analytics.logVenueContact({ type: 'phoneNumber', venueId })
    openPhoneNumber(phoneNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber])

  const onPressWebsite = useCallback(() => {
    if (!website) return
    analytics.logVenueContact({ type: 'website', venueId })
    openUrl(website)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [website])

  if (!venue || !venue.contact) return <React.Fragment></React.Fragment>

  return (
    <Container>
      {!!email && <ContactAtom label="E-mail" onPress={onPressMail} Icon={EmailFilled} />}
      {!!(phoneNumber && isValidFrenchPhoneNumber(phoneNumber)) && (
        <ContactAtom label="Téléphone" onPress={onPressPhone} Icon={PhoneFilled} />
      )}
      {!!website && (
        <ContactAtom label="Site internet" onPress={onPressWebsite} Icon={ExternalSiteFilled} />
      )}
    </Container>
  )
}

type ContactAtomProps = {
  label: string
  onPress: () => void
  Icon: React.FC<IconInterface>
}

const ContactAtom = ({ label, onPress, Icon }: ContactAtomProps) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
  }))``

  return (
    <StyledTouchableOpacity onPress={onPress} accessibilityLabel={label}>
      <StyledIcon testID={`Icon ${label}`} />
      <Spacer.Row numberOfSpaces={2} />
      <Typo.ButtonText>{label}</Typo.ButtonText>
    </StyledTouchableOpacity>
  )
}

const Container = styled.View({
  marginVertical: -getSpacing(1),
})

const StyledTouchableOpacity = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: getSpacing(1),
})
