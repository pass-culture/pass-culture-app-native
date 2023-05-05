import React from 'react'

import { useVenue } from 'features/venue/api/useVenue'
import { Typo } from 'ui/theme'

export const ContactBlock: React.FC<{ venueId: number }> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)
  const { email, phoneNumber, website } = venue?.contact ?? {}

  return (
    <React.Fragment>
      {!!email && <Typo.Body>{email}</Typo.Body>}
      {!!phoneNumber && <Typo.Body>{phoneNumber}</Typo.Body>}
      {!!website && <Typo.Body>{website}</Typo.Body>}
    </React.Fragment>
  )
}
