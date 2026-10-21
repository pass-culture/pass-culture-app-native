import { useIsFocused } from '@react-navigation/native'
import { FlashList, FlashListRef } from '@shopify/flash-list'
import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  useWindowDimensions,
} from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'
import { v4 } from 'uuid'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { usePreviousRouteName } from 'features/navigation/helpers/usePreviousRouteName'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { ListHeaderComponent } from 'features/search/pages/SearchResults/v2/components/SearchLists/components/ListHeaderComponent'
import { ANIMATION_DURATION } from 'features/search/pages/SearchResults/v2/components/SearchLists/searchLists.constants'
import { SearchOfferItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchListsItems/SearchOfferItemWrapper'
import { SearchMapButton } from 'features/search/pages/SearchResults/v2/components/SearchMap/components/SearchMapButton'
import { OffersListSkeleton } from 'features/search/pages/SearchResults/v2/components/SearchSkeletons/OffersListSkeleton'
import { getSearchQueryKey } from 'features/search/queries/helpers'
import { selectSearchOffers } from 'features/search/queries/useSearchOffersQuery/selectors/selectSearchOffers'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { useGridListLayout } from 'features/search/store/gridListLayoutStore'
import { FetchSearchResultsArgs, GridListLayout, SearchView } from 'features/search/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { logViewItem } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { Offer } from 'shared/offer/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { LineSeparator } from 'ui/components/LineSeparator'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { Ul } from 'ui/components/Ul'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const searchIdGenerated = v4()
const isWeb = Platform.OS === 'web'

type Props = {
  searchFilters: FetchSearchResultsArgs
  playlistIndex?: number
}

export const OffersList: FC<PropsWithChildren<Props>> = ({
  children,
  searchFilters,
  playlistIndex = 0,
}) => {
  const { tabBarHeight } = useCustomSafeInsets()
  const transformHits = useTransformOfferHits()

  const {
    data: offersResponse,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isSuccess,
    isFetching,
    isLoading,
  } = useSearchOffersQuery(searchFilters, {
    select: (offersResponse) => selectSearchOffers({ data: offersResponse, transformHits }),
  })

  const { width } = useWindowDimensions()
  const { designSystem, breakpoints, tabBar } = useTheme()
  const margin = designSystem.size.spacing.xl
  const gutter = designSystem.size.spacing.l
  const { nbrOfTilesToDisplay } = getGridTileRatio({
    screenWidth: width,
    margin,
    gutter,
    breakpoint: breakpoints.lg,
  })

  const enableGridList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST)
  const gridListLayout = useGridListLayout()
  const shouldDisplayGridList = enableGridList && !isWeb
  const isGridLayout = shouldDisplayGridList && gridListLayout === GridListLayout.GRID

  const { searchState } = useSearch()

  const isFocused = useIsFocused()

  const handleEndReached = async () => {
    if (!isFocused || !offersResponse || !hasNextPage) {
      return
    }

    const page = offersResponse.lastPage?.offersResponse.page ?? 0

    if (page > 0) {
      const currentSearchId = searchState.searchId ?? searchIdGenerated
      void analytics.logSearchScrollToPage(page, currentSearchId)
    }
    await fetchNextPage()
  }

  const listRef = useRef<FlashListRef<Offer> | null>(null)

  const shouldRenderScrollToTopButton = (offersResponse?.nbHits || 0) > 0 && !isWeb

  const previousRouteName = usePreviousRouteName()
  const { disabilities } = useAccessibilityFiltersContext()

  // Mirrors the query key of useSearchOffersQuery to identify one effective search.
  const searchOffersQueryKey = JSON.stringify([
    searchFilters.buildLocationParameterParams.userLocation,
    searchFilters.disabilitiesProperties,
    getSearchQueryKey(searchFilters.parameters),
  ])

  const lastLoggedSearchKey = useRef<string>(undefined)

  const logPerformSearchOnce = () => {
    if (!isSuccess || isFetching || lastLoggedSearchKey.current === searchOffersQueryKey) {
      return
    }
    lastLoggedSearchKey.current = searchOffersQueryKey

    void analytics.logPerformSearch(
      searchState,
      disabilities,
      offersResponse.nbHits,
      previousRouteName === SearchView.Thematic ? previousRouteName : SearchView.Results
    )

    if (!offersResponse?.nbHits) {
      void analytics.logNoSearchResult(searchState.query, searchState.searchId)
    }
  }

  useEffect(logPerformSearchOnce, [
    disabilities,
    isFetching,
    isSuccess,
    offersResponse?.nbHits,
    previousRouteName,
    searchOffersQueryKey,
    searchState,
  ])

  const [shouldDisplayMapButtonText, setShouldDisplayMapButtonText] = useState(true)
  const { headerTransition: scrollButtonTransition, onScroll: onScrollOpacity } =
    useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScrollOpacity(event)
    const currentOffset = event.nativeEvent.contentOffset.y
    setShouldDisplayMapButtonText(currentOffset <= headerHeight)
  }

  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  if (showSkeleton) return <OffersListSkeleton />

  const listHeaderComponent = children ? (
    children
  ) : (
    <ListHeaderComponent title="Les offres" nbItems={offersResponse?.offers.length ?? 0} />
  )

  return (
    <Container>
      <ObservedPlaylist<FlashListRef<Offer>>
        listRef={listRef}
        fill
        onItemViewed={({ index, item }) => {
          if (!isFocused) return
          void logViewItem({
            origin: 'search',
            playlistIndex,
            index,
            type: 'offer',
            id: item.objectID,
            playlistId: 'searchResults',
            originId: searchState.searchId ?? searchIdGenerated,
          })
        }}>
        {({ handleViewableItemsChanged }) => (
          <FlashList
            ref={listRef}
            key="offers_search_results"
            accessibilityRole={AccessibilityRole.LIST}
            data={offersResponse?.offers}
            keyExtractor={(item: Offer) => item.objectID}
            ListHeaderComponent={<React.Fragment>{listHeaderComponent}</React.Fragment>}
            renderItem={({ item, index }) => <SearchOfferItemWrapper item={item} index={index} />}
            onViewableItemsChanged={handleViewableItemsChanged}
            contentContainerStyle={{
              paddingBottom: tabBar.height + designSystem.size.spacing.xxxl,
              paddingHorizontal: designSystem.size.spacing.xl,
            }}
            ItemSeparatorComponent={isGridLayout ? undefined : LineSeparator}
            numColumns={isGridLayout ? nbrOfTilesToDisplay : undefined}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={handleEndReached}
            scrollEnabled={!!offersResponse?.nbHits}
            onScroll={handleScroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        )}
      </ObservedPlaylist>

      <FloatingButtonsWrapper
        tabBarHeight={tabBarHeight}
        layout={LinearTransition.springify().damping(15).stiffness(20).duration(1000)}>
        {shouldRenderScrollToTopButton ? (
          <ScrollToTopButton
            transition={scrollButtonTransition}
            onPress={() => {
              listRef.current?.scrollToOffset({ offset: 0 })
            }}
          />
        ) : null}

        <SearchMapButton shouldDisplayMapButtonText={shouldDisplayMapButtonText} />
      </FloatingButtonsWrapper>
    </Container>
  )
}

const Container = styled(Ul).attrs({ accessibilityRole: AccessibilityRole.NONE })({
  flex: 1,
  flexDirection: 'column',
})

const FloatingButtonsWrapper = styled(Animated.View)<{ tabBarHeight: number }>(
  ({ theme, tabBarHeight }) => ({
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.designSystem.size.spacing.s,
    right: theme.designSystem.size.spacing.xl,
    bottom: tabBarHeight + theme.designSystem.size.spacing.xl,
    zIndex: theme.zIndex.floatingButton,
  })
)
