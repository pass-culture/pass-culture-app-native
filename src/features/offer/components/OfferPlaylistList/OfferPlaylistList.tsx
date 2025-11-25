import { useIsFocused, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ViewToken } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse, RecommendationApiParams } from 'api/gen'
import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { OfferPlaylistItem } from 'features/offer/components/OfferPlaylistItem/OfferPlaylistItem'
import { PlaylistType } from 'features/offer/enums'
import { useLogPlaylist } from 'features/offer/helpers/useLogPlaylistVertical/useLogPlaylistVertical'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { AlgoliaOfferWithArtistAndEan } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer, SimilarOfferPlaylist } from 'shared/offer/types'
import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

export type OfferPlaylistListProps = {
  offer: OfferResponse
  sameCategorySimilarOffers?: Offer[]
  apiRecoParamsSameCategory?: RecommendationApiParams
  otherCategoriesSimilarOffers?: Offer[]
  apiRecoParamsOtherCategories?: RecommendationApiParams
  onViewableItemsChanged: (
    items: Pick<ViewToken, 'key' | 'index'>[],
    moduleId: string,
    itemType: 'offer' | 'venue' | 'artist' | 'unknown',
    playlistIndex?: number
  ) => void
  seeAllButton: {
    navigateToVerticalPlaylist: (type: PlaylistType) => InternalNavigationProps['navigateTo']
    onBeforeNavigate: (type: PlaylistType) => void
    hidePlaylistSeeAll?: boolean
    hideSearchSeeAll?: boolean
  }
  proAdvicesSegment?: string
}

function isArrayNotEmpty<T>(data: T[] | undefined): data is T[] {
  return Boolean(data?.length)
}

const keyExtractor = (item: Offer | AlgoliaOfferWithArtistAndEan) => item.objectID

export function OfferPlaylistList({
  offer,
  sameCategorySimilarOffers,
  apiRecoParamsSameCategory,
  otherCategoriesSimilarOffers,
  apiRecoParamsOtherCategories,
  onViewableItemsChanged,
  seeAllButton,
  proAdvicesSegment,
}: Readonly<OfferPlaylistListProps>) {
  const theme = useTheme()
  const isLandscape = useIsLandscape()

  const route = useRoute<UseRouteType<'Offer'>>()
  const isFocused = useIsFocused()
  const fromOfferId = route.params?.fromOfferId
  const categoryMapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

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
    void analytics.logPlaylistHorizontalScroll(fromOfferId, playlistType, apiRecoParams)
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

  const shouldDisplayPlaylist =
    isArrayNotEmpty(sameCategorySimilarOffers) || isArrayNotEmpty(otherCategoriesSimilarOffers)

  const handleOfferPlaylistViewableItemsChanged = useCallback(
    (playlistType: string, playlistIndex: number) =>
      (items: Pick<ViewToken, 'key' | 'index'>[]) => {
        if (!isFocused) return
        onViewableItemsChanged(items, playlistType, 'offer', playlistIndex)
      },
    [isFocused, onViewableItemsChanged]
  )

  return (
    <SectionWithDivider visible={shouldDisplayPlaylist} gap={8}>
      {similarOffersPlaylist.map((playlist, index) => {
        if (!isArrayNotEmpty(playlist.offers)) return null

        const navigateToVerticalPlaylist = seeAllButton.navigateToVerticalPlaylist(playlist.type)
        const onBeforeNavigate = () => seeAllButton.onBeforeNavigate(playlist.type)
        const hidePlaylistSeeAll = seeAllButton.hidePlaylistSeeAll
        const hideSearchSeeAll = seeAllButton.hideSearchSeeAll

        return (
          <ObservedPlaylist
            key={playlist.type}
            onViewableItemsChanged={handleOfferPlaylistViewableItemsChanged(playlist.type, index)}
            onIntersectionChange={playlist.handleChangePlaylistDisplay}>
            {({ listRef }) => (
              <StyledPassPlaylist
                data={playlist.offers ?? []}
                itemWidth={itemWidth}
                itemHeight={itemHeight}
                renderItem={OfferPlaylistItem({
                  offer,
                  labelMapping,
                  categoryMapping,
                  currency,
                  euroToPacificFrancRate,
                  navigationMethod: 'push',
                  apiRecoParams: playlist.apiRecoParams,
                  priceDisplay: (item: Offer) =>
                    getDisplayedPrice(item.offer.prices, currency, euroToPacificFrancRate),
                  theme,
                  proAdvicesSegment,
                })}
                title={playlist.title}
                playlistType={playlist.type}
                onEndReached={() =>
                  trackingOnHorizontalScroll(playlist.type, playlist.apiRecoParams)
                }
                playlistRef={listRef}
                FlatListComponent={FlatList}
                keyExtractor={keyExtractor}
                seeAllButton={{
                  navigateToVerticalPlaylist,
                  onBeforeNavigate,
                  hidePlaylistSeeAll,
                  hideSearchSeeAll,
                }}
              />
            )}
          </ObservedPlaylist>
        )
      })}
      {isLandscape ? <PlaceholderBehindButton /> : null}
    </SectionWithDivider>
  )
}

const PlaceholderBehindButton = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xxxxl,
}))

const StyledPassPlaylist = styled(PassPlaylist)({
  paddingBottom: 0,
})
