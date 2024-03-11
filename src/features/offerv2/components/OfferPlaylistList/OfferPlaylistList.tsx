import { useRoute } from '@react-navigation/native'
import React from 'react'

import { OfferResponse } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useLogPlaylist } from 'features/offer/helpers/useLogPlaylistVertical/useLogPlaylistVertical'
import { HitOfferWithArtistAndEan } from 'features/offerv2/api/fetchOffersByArtist/fetchOffersByArtist'
import { OfferPlaylist } from 'features/offerv2/components/OfferPlaylist/OfferPlaylist'
import { OfferTile } from 'features/offerv2/components/OfferTile/OfferTile'
import { PlaylistType } from 'features/offerv2/enums'
import { useLogScrollHandler } from 'features/offerv2/helpers/useLogScrolHandler/useLogScrollHandler'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import { Position } from 'libs/location'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer, RecommendationApiParams, SimilarOfferPlaylist } from 'shared/offer/types'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Spacer } from 'ui/theme'

export type OfferPlaylistListProps = {
  offer: OfferResponse
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

export function OfferPlaylistList({
  offer,
  position,
  sameCategorySimilarOffers,
  apiRecoParamsSameCategory,
  otherCategoriesSimilarOffers,
  apiRecoParamsOtherCategories,
  sameArtistPlaylist,
}: Readonly<OfferPlaylistListProps>) {
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params?.fromOfferId
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const { sameAuthorPlaylist: sameAuthorPlaylistConfig } = useRemoteConfigContext()

  const {
    logSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
    logSameArtistPlaylistVerticalScroll,
  } = useLogPlaylist({
    offerId: offer.id,
    nbSameArtistPlaylist: sameArtistPlaylist?.length ?? 0,
    apiRecoParamsSameCategory,
    nbSameCategorySimilarOffers: sameCategorySimilarOffers?.length ?? 0,
    apiRecoParamsOtherCategories,
    nbOtherCategoriesSimilarOffers: otherCategoriesSimilarOffers?.length ?? 0,
    fromOfferId,
  })

  const handleChangeSameArtistPlaylistDisplay = useLogScrollHandler(
    logSameArtistPlaylistVerticalScroll
  )

  const handleChangeOtherCategoriesPlaylistDisplay = useLogScrollHandler(
    logOtherCategoriesPlaylistVerticalScroll
  )

  const handleChangeSameCategoryPlaylistDisplay = useLogScrollHandler(
    logSameCategoryPlaylistVerticalScroll
  )

  const enableSameArtistPlaylist = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SAME_ARTIST_PLAYLIST)
  const shouldDisplaySameArtistPlaylist =
    !!isArrayNotEmpty(sameArtistPlaylist) && enableSameArtistPlaylist

  const trackingOnHorizontalScroll = () => {
    analytics.logPlaylistHorizontalScroll(fromOfferId)
  }

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

  const sameCategorySimilarOffersPlaylist: SimilarOfferPlaylist = {
    type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    title: 'Dans la même catégorie',
    offers: sameCategorySimilarOffers,
    apiRecoParams: apiRecoParamsSameCategory,
    handleChangePlaylistDisplay: handleChangeSameCategoryPlaylistDisplay,
  }

  const otherCategoriesSimilarOffersPlaylist: SimilarOfferPlaylist = {
    type: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
    title: 'Ça peut aussi te plaire',
    offers: otherCategoriesSimilarOffers,
    apiRecoParams: apiRecoParamsOtherCategories,
    handleChangePlaylistDisplay: handleChangeOtherCategoriesPlaylistDisplay,
  }

  const sameArtistOffersPlaylist: SimilarOfferPlaylist = {
    type: PlaylistType.SAME_ARTIST_PLAYLIST,
    title: 'Du même auteur',
    offers: sameArtistPlaylist,
    handleChangePlaylistDisplay: handleChangeSameArtistPlaylistDisplay,
  }

  const similarOffersPlaylist: SimilarOfferPlaylist[] = []
  if (sameAuthorPlaylistConfig === 'withPlaylistAsFirst' && shouldDisplaySameArtistPlaylist) {
    similarOffersPlaylist.push(sameArtistOffersPlaylist)
  }
  similarOffersPlaylist.push(
    sameCategorySimilarOffersPlaylist,
    otherCategoriesSimilarOffersPlaylist
  )
  if (sameAuthorPlaylistConfig === 'withPlaylistAsLast' && shouldDisplaySameArtistPlaylist) {
    similarOffersPlaylist.push(sameArtistOffersPlaylist)
  }

  const shouldDisplayPlaylist =
    isArrayNotEmpty(sameCategorySimilarOffers) ||
    isArrayNotEmpty(otherCategoriesSimilarOffers) ||
    isArrayNotEmpty(sameArtistPlaylist)

  return (
    <SectionWithDivider visible={shouldDisplayPlaylist}>
      <React.Fragment>
        <Spacer.Column numberOfSpaces={6} />
        {similarOffersPlaylist.map((playlist) => {
          if (!isArrayNotEmpty(playlist.offers)) {
            return null
          }

          return (
            <IntersectionObserver
              onChange={playlist.handleChangePlaylistDisplay}
              threshold="50%"
              key={playlist.type}>
              <OfferPlaylist
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
    </SectionWithDivider>
  )
}
