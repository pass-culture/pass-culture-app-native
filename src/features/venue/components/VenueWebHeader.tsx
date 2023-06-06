import React from 'react'

import { VenueResponse } from 'api/gen'
import { Helmet } from 'libs/react-helmet/Helmet'

import { description } from '../../../../package.json'

interface Props {
  venue: VenueResponse
}

export const VenueWebHeader = ({ venue }: Props) => (
  <Helmet>
    <title>{(venue.publicName ?? venue.name) + ' | pass Culture'}</title>
    <meta name="title" content={venue.publicName ?? venue.name} />
    <meta name="description" content={venue.description ?? description} />
  </Helmet>
)
