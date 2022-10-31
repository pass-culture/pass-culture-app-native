import React from 'react'

import { OfferTile, OfferTileProps } from 'features/offer/components/OfferTile/OfferTile'

type Props = Omit<OfferTileProps, 'analyticsFrom'>

export const VenueOfferTile = (props: Props) => {
  return <OfferTile {...props} analyticsFrom="venue" />
}
