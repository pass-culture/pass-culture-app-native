import { useRoute } from '@react-navigation/native'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylistOld/api/fetchOffersByArtist'
import { OfferPlaylistOld } from 'features/offer/components/OfferPlaylistOld/component/OfferPlaylistOld'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Position } from 'libs/location'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer, RecommendationApiParams, SimilarOfferPlaylist } from 'shared/offer/types'

export type OfferPlaylistListOldProps = {
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

type PlaylistItemProps = {
  offer: OfferResponse
  position: Position
  categoryMapping: CategoryIdMapping
  labelMapping: CategoryHomeLabelMapping
  apiRecoParams?: RecommendationApiParams
}

type RenderPlaylistItemProps = {
  item: Offer
  width: number
  height: number
  playlistType?: PlaylistType
}

const renderPlaylistItem = ({
  offer,
  position,
  categoryMapping,
  labelMapping,
  apiRecoParams,
}: PlaylistItemProps) => {
  return function RenderItem({ item, width, height, playlistType }: RenderPlaylistItemProps) {
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
  }
}

const doNothingWithIntersectionObserverYet = () => {
  // In a first time, we don't use intersection observer to trigger analytics for similar offers playlist
  // For the moment, we use a calculation compared to the bottom of the component and the position of the playlist
  return
}

export function OfferPlaylistListOld({
  offer,
  position,
  sameCategorySimilarOffers,
  apiRecoParamsSameCategory,
  otherCategoriesSimilarOffers,
  apiRecoParamsOtherCategories,
  sameArtistPlaylist,
  handleChangeSameArtistPlaylistDisplay,
}: Readonly<OfferPlaylistListOldProps>) {
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params?.fromOfferId
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const enableSameArtistPlaylist = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SAME_ARTIST_PLAYLIST)
  const shouldDisplaySameArtistPlaylist =
    !!isArrayNotEmpty(sameArtistPlaylist) && enableSameArtistPlaylist

  const trackingOnHorizontalScroll = () => {
    analytics.logPlaylistHorizontalScroll(fromOfferId)
  }

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

  let similarOffersPlaylist: SimilarOfferPlaylist[] = [
    {
      type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      title: 'Dans la même catégorie',
      offers: sameCategorySimilarOffers,
      apiRecoParams: apiRecoParamsSameCategory,
      handleChangePlaylistDisplay: doNothingWithIntersectionObserverYet,
    },
    {
      type: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      title: 'Ça peut aussi te plaire',
      offers: otherCategoriesSimilarOffers,
      apiRecoParams: apiRecoParamsOtherCategories,
      handleChangePlaylistDisplay: doNothingWithIntersectionObserverYet,
    },
  ]

  if (shouldDisplaySameArtistPlaylist) {
    similarOffersPlaylist = [
      {
        type: PlaylistType.SAME_ARTIST_PLAYLIST,
        title: 'Du même auteur',
        offers: sameArtistPlaylist,
        handleChangePlaylistDisplay: handleChangeSameArtistPlaylistDisplay,
      },
      ...similarOffersPlaylist,
    ]
  }

  return (
    <React.Fragment>
      {similarOffersPlaylist.map((playlist) => {
        if (!isArrayNotEmpty(playlist.offers)) {
          return null
        }

        return (
          <IntersectionObserver
            onChange={playlist.handleChangePlaylistDisplay}
            threshold="50%"
            key={playlist.type}>
            <OfferPlaylistOld
              items={playlist.offers}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
              renderItem={renderPlaylistItem({
                offer,
                position,
                categoryMapping,
                labelMapping,
                apiRecoParams: playlist.apiRecoParams,
              })}
              title={playlist.title}
              onEndReached={trackingOnHorizontalScroll}
              playlistType={playlist.type}
            />
          </IntersectionObserver>
        )
      })}
    </React.Fragment>
  )
}
