import React from 'react'

import { OfferResponseV2, RecommendationApiParams } from 'api/gen'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { OfferTileProps } from 'features/offer/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Offer } from 'shared/offer/types'

type OfferPlaylistItemProps = {
  offer: OfferResponseV2
  categoryMapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  apiRecoParams?: RecommendationApiParams
  variant: OfferTileProps['variant']
}

type RenderOfferPlaylistItemProps = {
  item: Offer
  width: number
  height: number
  playlistType?: PlaylistType
}

export const OfferPlaylistItem = ({
  offer,
  categoryMapping,
  labelMapping,
  apiRecoParams,
  variant,
}: OfferPlaylistItemProps) => {
  return function RenderItem({ item, width, height, playlistType }: RenderOfferPlaylistItemProps) {
    const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)

    return (
      <OfferTile
        offerLocation={item._geoloc}
        categoryLabel={labelMapping[item.offer.subcategoryId]}
        categoryId={categoryMapping[item.offer.subcategoryId]}
        subcategoryId={item.offer.subcategoryId}
        offerId={+item.objectID}
        name={item.offer.name}
        date={formatDates(timestampsInMillis)}
        isDuo={item.offer.isDuo}
        thumbUrl={item.offer.thumbUrl}
        price={getDisplayPrice(item.offer.prices)}
        width={width}
        height={height}
        analyticsFrom="offer"
        fromOfferId={offer.id}
        playlistType={playlistType}
        apiRecoParams={apiRecoParams}
        variant={variant}
      />
    )
  }
}
