import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { useVenue } from 'features/venue/api/useVenue'
import { analytics } from 'libs/analytics'
import { isValidFrenchPhoneNumber, openPhoneNumber, openMail } from 'ui/components/contact/helpers'
import { ExternalLinkSquare } from 'ui/svg/icons/ExternalLinkSquare'
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

  const labelEmail = `Contacter ${venue.publicName || venue.name}`

  return (
    <React.Fragment>
      {!!email && <ContactAtom label={labelEmail} onPress={onPressMail} />}
      {!!(phoneNumber && isValidFrenchPhoneNumber(phoneNumber)) && (
        <ContactAtom label={phoneNumber} onPress={onPressPhone} />
      )}
      {!!website && <ContactAtom label={website} onPress={onPressWebsite} />}
    </React.Fragment>
  )
}

type ContactAtomProps = {
  label: string
  onPress: () => void
}

const ContactAtom = ({ label, onPress }: ContactAtomProps) => (
  <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={onPress}>
    <ExternalLinkSquare size={getSpacing(6)} testID="ExternalLinkSquare" />
    <Spacer.Row numberOfSpaces={2} />
    <Typo.ButtonText>{label}</Typo.ButtonText>
  </TouchableOpacity>
)

const TouchableOpacity = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({ flexDirection: 'row', alignItems: 'center', marginVertical: getSpacing(1) })
