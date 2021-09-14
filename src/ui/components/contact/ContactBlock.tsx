import React from 'react'
import styled from 'styled-components/native'

import { OfferVenueResponse, VenueContactModel, VenueResponse } from 'api/gen'
import { openExternalPhoneNumber, openExternalUrl } from 'features/navigation/helpers'
import { useBrowserDetect } from 'libs/hooks/useBrowserDetect'
import { isValidFrenchPhoneNumber } from 'ui/components/contact/frenchPhoneNumberCheck'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { ExternalLinkSquare } from 'ui/svg/icons/ExternalLinkSquare'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface VenueContact extends VenueContactModel {
  venue: OfferVenueResponse | VenueResponse
}

export const ContactBlock: React.FC<VenueContact> = ({ venue, email, phoneNumber, website }) => {
  const { isBrowser } = useBrowserDetect()
  return (
    <Container>
      {renderContactAtom(venue, email, isBrowser)}
      {renderContactAtom(venue, phoneNumber, isBrowser)}
      {renderContactAtom(venue, website, isBrowser)}
    </Container>
  )
}

const renderContactAtom = (
  venue: OfferVenueResponse | VenueResponse,
  contactInformations: string | undefined,
  isBrowser: boolean
) => {
  const openContact = () => {
    if (contactInformations) {
      const isEmail = isEmailValid(contactInformations)
      const isPhoneNumber = isValidFrenchPhoneNumber(contactInformations)

      if (isEmail) {
        openExternalUrl(`mailto:${contactInformations}`)
      } else if (isPhoneNumber) {
        openExternalPhoneNumber(contactInformations)
      } else {
        openExternalUrl(contactInformations)
      }
    }
  }

  const labelInformation =
    contactInformations && isEmailValid(contactInformations) && !isBrowser
      ? `Contacter ${venue.publicName}`
      : contactInformations

  return contactInformations !== null && contactInformations !== undefined && !isBrowser ? (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={openContact} disabled={isBrowser}>
      <ExternalLinkSquare size={getSpacing(6)} testID="ExternalLinkSquare" />
      <Spacer.Row numberOfSpaces={2} />
      <Typo.ButtonText>{labelInformation}</Typo.ButtonText>
    </TouchableOpacity>
  ) : (
    <WebLabelInformation>{labelInformation}</WebLabelInformation>
  )
}

const marginVertical = getSpacing(1)

const Container = styled.View({
  marginVertical: -marginVertical,
})

const TouchableOpacity = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({ flexDirection: 'row', alignItems: 'center', marginVertical })

const WebLabelInformation = styled(Typo.Body)({
  marginVertical,
})
