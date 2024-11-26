import React from 'react'

import { OfferResponseV2, RecommendationApiParams } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { OfferTileProps } from 'features/offer/types'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  SubcategoryOfferLabelMapping,
} from 'libs/subcategories/types'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'

type OfferPlaylistItemProps = {
  offer: OfferResponseV2
  categoryMapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping | SubcategoryOfferLabelMapping
  variant: OfferTileProps['variant']
  artistName?: string
  apiRecoParams?: RecommendationApiParams
  analyticsFrom?: Referrals
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
}: OfferPlaylistItemProps) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

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
        price={getDisplayPrice(item.offer.prices, currency, euroToPacificFrancRate)}
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
