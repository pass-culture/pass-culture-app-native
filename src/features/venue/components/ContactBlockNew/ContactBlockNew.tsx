import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { openUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PhoneFilled } from 'ui/svg/icons/PhoneFilled'
import { IconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

import { isValidFrenchPhoneNumber, openPhoneNumber, openMail } from './helpers'

export const ContactBlock: React.FC<{ venue: VenueResponse }> = ({ venue }) => {
  const { email, phoneNumber, website } = venue.contact || {}

  const onPressMail = useCallback(() => {
    if (!email) return
    analytics.logVenueContact({ type: 'email', venueId: venue.id })
    openMail(email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const onPressPhone = useCallback(() => {
    if (!phoneNumber) return
    analytics.logVenueContact({ type: 'phoneNumber', venueId: venue.id })
    openPhoneNumber(phoneNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber])

  const onPressWebsite = useCallback(() => {
    if (!website) return
    analytics.logVenueContact({ type: 'website', venueId: venue.id })
    openUrl(website)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [website])

  if (
    !venue?.contact ||
    (!venue.contact.email && !venue.contact.phoneNumber && !venue.contact.website)
  )
    return null

  return (
    <React.Fragment>
      {!!email && (
        <React.Fragment>
          <ContactAtom label={email} onPress={onPressMail} Icon={EmailFilled} />
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      {!!(phoneNumber && isValidFrenchPhoneNumber(phoneNumber)) && (
        <React.Fragment>
          <ContactAtom label={phoneNumber} onPress={onPressPhone} Icon={PhoneFilled} />
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      {!!website && (
        <ContactAtom label={website} onPress={onPressWebsite} Icon={ExternalSiteFilled} />
      )}
    </React.Fragment>
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
      <StyledIcon />
      <Spacer.Row numberOfSpaces={2} />
      <Typo.ButtonText>{label}</Typo.ButtonText>
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
})
