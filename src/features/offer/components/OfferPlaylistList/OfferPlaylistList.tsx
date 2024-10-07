import { useRoute } from '@react-navigation/native'
import React from 'react'

import { OfferResponseV2, RecommendationApiParams } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferPlaylist } from 'features/offer/components/OfferPlaylist/OfferPlaylist'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { useLogPlaylist } from 'features/offer/helpers/useLogPlaylistVertical/useLogPlaylistVertical'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { analytics } from 'libs/analytics'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer, SimilarOfferPlaylist } from 'shared/offer/types'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

export type OfferPlaylistListProps = {
  offer: OfferResponseV2
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
}

function isArrayNotEmpty<T>(data: T[] | undefined): data is T[] {
  return Boolean(data?.length)
}

export function OfferPlaylistList({
  offer,
  sameCategorySimilarOffers,
  apiRecoParamsSameCategory,
  otherCategoriesSimilarOffers,
  apiRecoParamsOtherCategories,
}: Readonly<OfferPlaylistListProps>) {
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params?.fromOfferId
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const isNewOfferTileDisplayed = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE)

  const { logSameCategoryPlaylistVerticalScroll, logOtherCategoriesPlaylistVerticalScroll } =
    useLogPlaylist({
      offerId: offer.id,
      apiRecoParamsSameCategory,
      nbSameCategorySimilarOffers: sameCategorySimilarOffers?.length ?? 0,
      apiRecoParamsOtherCategories,
      nbOtherCategoriesSimilarOffers: otherCategoriesSimilarOffers?.length ?? 0,
      fromOfferId,
    })

  const handleChangeOtherCategoriesPlaylistDisplay = useLogScrollHandler(
    logOtherCategoriesPlaylistVerticalScroll
  )

  const handleChangeSameCategoryPlaylistDisplay = useLogScrollHandler(
    logSameCategoryPlaylistVerticalScroll
  )

  const trackingOnHorizontalScroll = (
    playlistType: PlaylistType,
    apiRecoParams?: RecommendationApiParams
  ) => {
    analytics.logPlaylistHorizontalScroll(fromOfferId, playlistType, apiRecoParams)
  }

  const { itemWidth, itemHeight } = usePlaylistItemDimensionsFromLayout('two-items')

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

  const similarOffersPlaylist: SimilarOfferPlaylist[] = [
    sameCategorySimilarOffersPlaylist,
    otherCategoriesSimilarOffersPlaylist,
  ]

  const shouldDisplayPlaylist =
    isArrayNotEmpty(sameCategorySimilarOffers) || isArrayNotEmpty(otherCategoriesSimilarOffers)

  return (
    <SectionWithDivider visible={shouldDisplayPlaylist} gap={8}>
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
              renderItem={OfferPlaylistItem({
                offer,
                categoryMapping,
                labelMapping,
                apiRecoParams: playlist.apiRecoParams,
                variant: isNewOfferTileDisplayed ? 'new' : 'default',
              })}
              title={playlist.title}
              onEndReached={() => trackingOnHorizontalScroll(playlist.type, playlist.apiRecoParams)}
              playlistType={playlist.type}
            />
          </IntersectionObserver>
        )
      })}
    </SectionWithDivider>
  )
}
