import { useRoute } from '@react-navigation/native'
import React, { createRef, RefObject, useRef } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2, RecommendationApiParams } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferPlaylist } from 'features/offer/components/OfferPlaylist/OfferPlaylist'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { useLogPlaylist } from 'features/offer/helpers/useLogPlaylistVertical/useLogPlaylistVertical'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import {
  formatStartPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer, SimilarOfferPlaylist } from 'shared/offer/types'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'

export type OfferPlaylistListProps = {
  offer: OfferResponseV2
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  onPlaylistViewableItemsChanged?: (playlistId: string, itemsId: string[]) => void
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
  onPlaylistViewableItemsChanged,
}: Readonly<OfferPlaylistListProps>) {
  const theme = useTheme()
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params?.fromOfferId
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const inViewPlaylists = useRef<string[]>([])

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

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

  const similarOffersPlaylist: SimilarOfferPlaylist[] = [
    sameCategorySimilarOffersPlaylist,
    otherCategoriesSimilarOffersPlaylist,
  ]

  const playlistRefs = similarOffersPlaylist.reduce(
    (previous, current) => {
      previous[current.title] = createRef<FlatList>()
      return previous
    },
    {} as Record<string, RefObject<FlatList | null>>
  )

  const handleIntersectionObserverChange = (playlist: SimilarOfferPlaylist, isInView: boolean) => {
    playlist.handleChangePlaylistDisplay(isInView)

    if (isInView) {
      inViewPlaylists.current.push(playlist.title)
      playlistRefs[playlist.title]?.current?.recordInteraction()
    } else {
      inViewPlaylists.current = inViewPlaylists.current.filter((title) => playlist.title !== title)
    }
  }

  const shouldDisplayPlaylist =
    isArrayNotEmpty(sameCategorySimilarOffers) || isArrayNotEmpty(otherCategoriesSimilarOffers)

  const viewableItemsHandlersRef = useRef<Record<string, (info: { changed: ViewToken[] }) => void>>(
    {}
  )

  if (Object.keys(viewableItemsHandlersRef.current).length === 0) {
    similarOffersPlaylist.forEach((playlist) => {
      viewableItemsHandlersRef.current[playlist.type] = ({ changed }) => {
        if (inViewPlaylists.current.includes(playlist.title)) {
          onPlaylistViewableItemsChanged?.(
            playlist.title,
            changed.map((value) => value.key)
          )
        }
      }
    })
  }

  return (
    <SectionWithDivider visible={shouldDisplayPlaylist} gap={8}>
      {similarOffersPlaylist.map((playlist) => {
        if (!isArrayNotEmpty(playlist.offers)) {
          return null
        }

        return (
          <IntersectionObserver
            onChange={(isInView: boolean) => {
              handleIntersectionObserverChange(playlist, isInView)
            }}
            threshold="50%"
            key={playlist.type}>
            <OfferPlaylist
              items={playlist.offers}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
              playlistRef={playlistRefs[playlist.title]}
              renderItem={OfferPlaylistItem({
                offer,
                labelMapping,
                categoryMapping,
                currency,
                euroToPacificFrancRate,
                navigationMethod: 'push',
                apiRecoParams: playlist.apiRecoParams,
                priceDisplay: (item: Offer) =>
                  getDisplayedPrice(
                    item.offer.prices,
                    currency,
                    euroToPacificFrancRate,
                    getIfPricesShouldBeFixed(item.offer.subcategoryId)
                      ? undefined
                      : formatStartPrice
                  ),
                theme,
              })}
              title={playlist.title}
              onEndReached={() => trackingOnHorizontalScroll(playlist.type, playlist.apiRecoParams)}
              playlistType={playlist.type}
              onViewableItemsChanged={viewableItemsHandlersRef.current[playlist.type]}
            />
          </IntersectionObserver>
        )
      })}
    </SectionWithDivider>
  )
}
