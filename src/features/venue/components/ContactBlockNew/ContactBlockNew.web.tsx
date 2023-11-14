import React from 'react'

import { VenueResponse } from 'api/gen'
import { Typo } from 'ui/theme'

export const ContactBlock: React.FC<{ venue: VenueResponse }> = ({ venue }) => {
  const { email, phoneNumber, website } = venue?.contact || {}

  return (
    <React.Fragment>
      {!!email && <Typo.Body>{email}</Typo.Body>}
      {!!phoneNumber && <Typo.Body>{phoneNumber}</Typo.Body>}
      {!!website && <Typo.Body>{website}</Typo.Body>}
    </React.Fragment>
  )
}
