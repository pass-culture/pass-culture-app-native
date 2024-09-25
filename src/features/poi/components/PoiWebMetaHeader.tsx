import React from 'react'

import { VenueResponse } from 'api/gen'
import { Helmet } from 'libs/react-helmet/Helmet'

import { description } from '../../../../package.json'

interface Props {
  poi: VenueResponse
}

export const PoiWebMetaHeader = ({ poi }: Props) => (
  <Helmet>
    <title>{(poi.publicName || poi.name) + ' | pass Culture'}</title>
    <meta name="title" content={poi.publicName || poi.name} />
    <meta name="description" content={poi.description || description} />
  </Helmet>
)
