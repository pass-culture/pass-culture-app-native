import React from 'react'

import { OfferResponseV2, RecommendationApiParams } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { OfferTileProps } from 'features/offer/types'
import { formatDates } from 'libs/parsers/formatDates'
import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  SubcategoryOfferLabelMapping,
} from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'

type OfferPlaylistItemProps = {
  offer: OfferResponseV2
  categoryMapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping | SubcategoryOfferLabelMapping
  variant: OfferTileProps['variant']
  currency: Currency
  euroToPacificFrancRate: number
  artistName?: string
  apiRecoParams?: RecommendationApiParams
  analyticsFrom?: Referrals
  priceDisplay: (item: Offer) => string
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
  variant,
  artistName,
  apiRecoParams,
  analyticsFrom = 'offer',
  priceDisplay,
}: OfferPlaylistItemProps) => {
  return function RenderItem({ item, width, height, playlistType }: RenderOfferPlaylistItemProps) {
    const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
    const categoryLabel = item.offer.bookFormat || labelMapping[offer.subcategoryId] || ''
    const categoryId = categoryMapping[offer.subcategoryId]

    return (
      <OfferTile
        offerLocation={item._geoloc}
        categoryLabel={categoryLabel}
        categoryId={categoryId}
        subcategoryId={item.offer.subcategoryId}
        offerId={+item.objectID}
        name={item.offer.name}
        date={formatDates(timestampsInMillis)}
        thumbUrl={item.offer.thumbUrl}
        price={priceDisplay(item)}
        width={width}
        height={height}
        analyticsFrom={analyticsFrom}
        fromOfferId={analyticsFrom === 'offer' ? offer.id : undefined}
        playlistType={playlistType}
        apiRecoParams={apiRecoParams}
        variant={variant}
        artistName={artistName}
      />
    )
  }
}
