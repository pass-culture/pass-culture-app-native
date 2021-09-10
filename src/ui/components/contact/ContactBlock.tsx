import React from 'react'
import styled from 'styled-components/native'

import { OfferVenueResponse, VenueContactModel, VenueResponse } from 'api/gen'
import { openExternalPhoneNumber, openExternalUrl } from 'features/navigation/helpers'
import { isValidFrenchPhoneNumber } from 'ui/components/contact/useValidFrenchPhoneNumber'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { ExternalLinkSquare } from 'ui/svg/icons/ExternalLinkSquare'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface VenueContact extends VenueContactModel {
  venue: OfferVenueResponse | VenueResponse
}

export const ContactBlock: React.FC<VenueContact> = ({ venue, email, phoneNumber, website }) => {
  return (
    <Container>
      {renderContactAtom(venue, email)}
      {renderContactAtom(venue, phoneNumber)}
      {renderContactAtom(venue, website)}
    </Container>
  )
}

const renderContactAtom = (
  venue: OfferVenueResponse | VenueResponse,
  contactInformations: string | undefined
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

  // TODO : Rendre disabled les boutons sur decliweb :
  // - Changer la police
  // - Afficher l'adresse mail plutôt que "Contacter ..."
  // - Retirer les logos de lien externe

  const labelInformation =
    contactInformations && isEmailValid(contactInformations)
      ? `Contacter ${venue.publicName}`
      : contactInformations

  return (
    !!(contactInformations !== null && contactInformations !== undefined) && (
      <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={openContact}>
        <ExternalLinkSquare size={getSpacing(6)} />
        <Spacer.Row numberOfSpaces={2} />
        <Typo.ButtonText>{labelInformation}</Typo.ButtonText>
      </TouchableOpacity>
    )
  )
}

const marginVertical = getSpacing(1)

const Container = styled.View({
  marginVertical: -marginVertical,
})

const TouchableOpacity = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({ flexDirection: 'row', alignItems: 'center', marginVertical })
