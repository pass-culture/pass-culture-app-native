import { t } from '@lingui/macro'
import React from 'react'

import { useVenue } from 'features/venue/api/useVenue'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  venueId: number
}

export const VenueOffers: React.FC<Props> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{t`Offres`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Caption>{venue.id}</Typo.Caption>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}
