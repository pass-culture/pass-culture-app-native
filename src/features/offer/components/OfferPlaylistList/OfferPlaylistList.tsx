import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { OfferResponse } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylist/api/fetchOffersByArtist'
import { OfferPlaylist } from 'features/offer/components/OfferPlaylist/component/OfferPlaylist'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Position } from 'libs/location'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer, RecommendationApiParams } from 'shared/offer/types'

export type OfferPlaylistListProps = {
  offer: OfferResponse
  handleChangeSameArtistPlaylistDisplay: (inView: boolean) => void
  position: Position
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  sameArtistPlaylist?: HitOfferWithArtistAndEan[]
}

function isArrayNotEmpty<T>(data: T[] | undefined): data is T[] {
  return Boolean(data?.length)
}

export function OfferPlaylistList({
  offer,
  position,
  sameCategorySimilarOffers,
  apiRecoParamsSameCategory,
  otherCategoriesSimilarOffers,
  apiRecoParamsOtherCategories,
  sameArtistPlaylist,
  handleChangeSameArtistPlaylistDisplay,
}: Readonly<OfferPlaylistListProps>) {
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params?.fromOfferId

  const enableSameArtistPlaylist = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SAME_ARTIST_PLAYLIST)
  const shouldDisplaySameArtistPlaylist =
    !!isArrayNotEmpty(sameArtistPlaylist) && enableSameArtistPlaylist

  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const trackingOnHorizontalScroll = useCallback(() => {
    return analytics.logPlaylistHorizontalScroll(fromOfferId)
  }, [fromOfferId])

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

  const renderItem = useCallback(
    (
      {
        item,
        width,
        height,
        playlistType,
      }: {
        item: Offer
        width: number
        height: number
        playlistType?: PlaylistType
      },
      apiRecoParams?: RecommendationApiParams
    ) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <OfferTile
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={categoryMapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
          distance={formatDistance(item._geoloc, position)}
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
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position, labelMapping, categoryMapping, offer.id]
  )
  return (
    <React.Fragment>
      {shouldDisplaySameArtistPlaylist ? (
        <IntersectionObserver onChange={handleChangeSameArtistPlaylistDisplay} threshold="50%">
          <OfferPlaylist
            key={offer.id}
            items={sameArtistPlaylist}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            renderItem={renderItem}
            title="Du même auteur"
            playlistType={PlaylistType.SAME_ARTIST_PLAYLIST}
          />
        </IntersectionObserver>
      ) : null}

      {isArrayNotEmpty(sameCategorySimilarOffers) ? (
        <OfferPlaylist
          items={sameCategorySimilarOffers}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          renderItem={({ item, width, height, playlistType }) =>
            renderItem({ item, width, height, playlistType }, apiRecoParamsSameCategory)
          }
          title="Dans la même catégorie"
          onEndReached={trackingOnHorizontalScroll}
          playlistType={PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS}
        />
      ) : null}

      {isArrayNotEmpty(otherCategoriesSimilarOffers) ? (
        <OfferPlaylist
          items={otherCategoriesSimilarOffers}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          renderItem={({ item, width, height, playlistType }) =>
            renderItem({ item, width, height, playlistType }, apiRecoParamsOtherCategories)
          }
          title="Ça peut aussi te plaire"
          onEndReached={trackingOnHorizontalScroll}
          playlistType={PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS}
        />
      ) : null}
    </React.Fragment>
  )
}
