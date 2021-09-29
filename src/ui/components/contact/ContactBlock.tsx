import { t } from '@lingui/macro'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { useVenue } from 'features/venue/api/useVenue'
import { analytics } from 'libs/analytics'
import { isValidFrenchPhoneNumber, openPhoneNumber, openMail } from 'ui/components/contact/helpers'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalLinkSquare } from 'ui/svg/icons/ExternalLinkSquare'
import { PhoneFilled } from 'ui/svg/icons/PhoneFilled'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const ContactBlock: React.FC<{ venueId: number }> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)
  const { email, phoneNumber, website } = venue?.contact || {}

  const onPressMail = useCallback(() => {
    if (!email) return
    analytics.logVenueContact({ type: 'email', venueId })
    openMail(email)
  }, [email])

  const onPressPhone = useCallback(() => {
    if (!phoneNumber) return
    analytics.logVenueContact({ type: 'phoneNumber', venueId })
    openPhoneNumber(phoneNumber)
  }, [phoneNumber])

  const onPressWebsite = useCallback(() => {
    if (!website) return
    analytics.logVenueContact({ type: 'website', venueId })
    openExternalUrl(website)
  }, [website])

  if (!venue || !venue.contact) return <React.Fragment></React.Fragment>

  return (
    <Container>
      {!!email && <ContactAtom label={t`E-mail`} onPress={onPressMail} Icon={EmailFilled} />}
      {!!(phoneNumber && isValidFrenchPhoneNumber(phoneNumber)) && (
        <ContactAtom label={t`Téléphone`} onPress={onPressPhone} Icon={PhoneFilled} />
      )}
      {!!website && (
        <ContactAtom label={t`Site internet`} onPress={onPressWebsite} Icon={ExternalLinkSquare} />
      )}
    </Container>
  )
}

type ContactAtomProps = {
  label: string
  onPress: () => void
  Icon: React.FC<IconInterface>
}

const ContactAtom = ({ label, onPress, Icon }: ContactAtomProps) => (
  <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={onPress}>
    <Icon size={getSpacing(6)} testID={`Icon ${label}`} />
    <Spacer.Row numberOfSpaces={2} />
    <Typo.ButtonText>{label}</Typo.ButtonText>
  </TouchableOpacity>
)

const Container = styled.View({
  marginVertical: -getSpacing(1),
})

const TouchableOpacity = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({ flexDirection: 'row', alignItems: 'center', marginVertical: getSpacing(1) })
