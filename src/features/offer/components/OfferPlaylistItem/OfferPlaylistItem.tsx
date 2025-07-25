import React from 'react'
import { DefaultTheme } from 'styled-components/native'

import { OfferResponseV2, RecommendationApiParams } from 'api/gen'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { renderInteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { OfferTileProps } from 'features/offer/types'
import { formatPlaylistDates, getTimeStampInMillis } from 'libs/parsers/formatDates'
import {
  CategoryHomeLabelMapping,
  CategoryIdMapping,
  SubcategoryOfferLabelMapping,
} from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'

type OfferPlaylistItemProps = {
  offer?: OfferResponseV2
  categoryMapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping | SubcategoryOfferLabelMapping
  currency: Currency
  euroToPacificFrancRate: number
  theme: DefaultTheme
  artistName?: string
  apiRecoParams?: RecommendationApiParams
  analyticsFrom?: Referrals
  priceDisplay: (item: Offer) => string
  navigationMethod?: OfferTileProps['navigationMethod']
  hasSmallLayout?: boolean
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
  artistName,
  apiRecoParams,
  theme,
  analyticsFrom = 'offer',
  navigationMethod,
  priceDisplay,
  hasSmallLayout,
}: OfferPlaylistItemProps) => {
  return function RenderItem({ item, width, height, playlistType }: RenderOfferPlaylistItemProps) {
    const timestampsInMillis = item.offer.dates && getTimeStampInMillis(item.offer.dates)
    const categoryLabel = item.offer.bookFormat || labelMapping[item.offer.subcategoryId] || ''
    const categoryId = categoryMapping[item.offer.subcategoryId]
    const tag = renderInteractionTag({
      theme,
      likesCount: item.offer.likes,
      chroniclesCount: item.offer.chroniclesCount,
      headlinesCount: item.offer.headlineCount,
      hasSmallLayout,
      isComingSoonOffer: getIsAComingSoonOffer(item.offer.bookingAllowedDatetime),
      subcategoryId: item.offer.subcategoryId,
    })
    return (
      <OfferTile
        offerLocation={item._geoloc}
        categoryLabel={categoryLabel}
        categoryId={categoryId}
        subcategoryId={item.offer.subcategoryId}
        offerId={+item.objectID}
        name={item.offer.name}
        date={formatPlaylistDates(timestampsInMillis)}
        thumbUrl={item.offer.thumbUrl}
        price={priceDisplay(item)}
        width={width}
        height={height}
        analyticsFrom={analyticsFrom}
        fromOfferId={analyticsFrom === 'offer' && offer ? offer.id : undefined}
        playlistType={playlistType}
        apiRecoParams={apiRecoParams}
        artistName={artistName}
        navigationMethod={navigationMethod}
        interactionTag={tag}
      />
    )
  }
}
