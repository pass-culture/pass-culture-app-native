import React from 'react'
import styled from 'styled-components/native'

import { VenueContactModel } from 'api/gen'
import { openExternalUrl } from 'features/navigation/helpers'
import { isValidFrenchPhoneNumber, openPhoneNumber, openMail } from 'ui/components/contact/helpers'
import { ExternalLinkSquare } from 'ui/svg/icons/ExternalLinkSquare'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface VenueContact extends VenueContactModel {
  venueName: string
}

export const ContactBlock: React.FC<VenueContact> = ({
  venueName,
  email,
  phoneNumber,
  website,
}) => {
  const phone = phoneNumber && isValidFrenchPhoneNumber(phoneNumber)

  return (
    <React.Fragment>
      {!!email && <ContactAtom label={`Contacter ${venueName}`} onPress={() => openMail(email)} />}
      {!!phone && <ContactAtom label={phoneNumber} onPress={() => openPhoneNumber(phoneNumber)} />}
      {!!website && <ContactAtom label={website} onPress={() => openExternalUrl(website)} />}
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
