import React from 'react'

import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { Offer } from 'shared/offer/types'
import { CustomListRenderItem } from 'ui/components/Playlist'

export const OfferNearMe: CustomListRenderItem<Offer> = ({ item, width, height }) => (
  <OfferTileWrapper item={item} width={width} height={height} analyticsFrom="offersNearMe" />
)
