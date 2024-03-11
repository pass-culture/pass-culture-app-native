import React from 'react'

import { OfferTile } from 'features/offerv2/components/OfferTile/OfferTile'
import { OfferTileProps } from 'features/offerv2/types'

type Props = Omit<OfferTileProps, 'analyticsFrom'>

export const HomeOfferTile = (props: Props) => {
  return <OfferTile {...props} analyticsFrom="home" />
}
