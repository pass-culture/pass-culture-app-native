import React from 'react'

import { VenueContactModel } from 'api/gen'
import { Typo } from 'ui/theme'

interface VenueContact extends VenueContactModel {
  venueName: string
}

export const ContactBlock: React.FC<VenueContact> = ({ email, phoneNumber, website }) => (
  <React.Fragment>
    <Typo.Body>{email}</Typo.Body>
    <Typo.Body>{phoneNumber}</Typo.Body>
    <Typo.Body>{website}</Typo.Body>
  </React.Fragment>
)
