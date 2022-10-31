import React from 'react'

import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { OfferTileProps } from 'features/offer/types'

type Props = Omit<OfferTileProps, 'analyticsFrom'>

export const VenueOfferTile = (props: Props) => {
  return <OfferTile {...props} analyticsFrom="venue" />
}
