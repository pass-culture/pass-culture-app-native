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
import { SearchMapContainer } from 'features/search/pages/SearchResults/v2/components/SearchMap/SearchMapContainer'
import { OffersListSkeleton } from 'features/search/pages/SearchResults/v2/components/SearchSkeletons/OffersListSkeleton'
import { selectSearchOffers } from 'features/search/queries/useSearchOffersQuery/selectors/selectSearchOffers'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { useGridListLayout } from 'features/search/store/gridListLayoutStore'
import { FetchSearchResultsArgs, GridListLayout, SearchView } from 'features/search/types'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useUserLocation } from 'libs/locationV2/location.store'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { Offer } from 'shared/offer/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'

const searchIdGenerated = v4()
const isWeb = Platform.OS === 'web'

type Props = {
  searchFilters: FetchSearchResultsArgs
  hasBeenClicked: boolean
  setHasBeenClicked: (hasBeenClicked: boolean) => void
}

export const OffersList: FC<PropsWithChildren<Props>> = ({
  children,
  searchFilters,
  hasBeenClicked,
  setHasBeenClicked,
}) => {
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

  const listRef = useRef<FlashListRef<Offer>>(null)

  const shouldRenderScrollToTopButton = (offersResponse?.nbHits || 0) > 0 && !isWeb

  const previousRouteName = usePreviousRouteName()
  const { disabilities } = useAccessibilityFiltersContext()

  useEffect(() => {
    if (isSuccess && !isFetching) {
      void analytics.logPerformSearch(
        searchState,
        disabilities,
        offersResponse?.nbHits ?? 0,
        previousRouteName === SearchView.Thematic ? previousRouteName : SearchView.Results
      )

      if (!offersResponse?.nbHits) {
        void analytics.logNoSearchResult(searchState.query, searchState.searchId)
      }
    }
  }, [disabilities, isFetching, isSuccess, offersResponse?.nbHits, previousRouteName, searchState])

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
  const isGeolocated = useUserLocation()
  if (showSkeleton) return <OffersListSkeleton />

  return (
    <React.Fragment>
      {hasBeenClicked && isGeolocated ? (
        <SearchMapContainer searchFilters={searchFilters} />
      ) : (
        <Container>
          <FlashList
            ref={listRef}
            key="offers_search_results"
            data={offersResponse?.offers}
            keyExtractor={(item: Offer) => item.objectID}
            ListHeaderComponent={
              children ? (
                <React.Fragment>{children}</React.Fragment>
              ) : (
                <ListHeaderComponent
                  title="Les offres"
                  nbItems={offersResponse?.offers.length ?? 0}
                />
              )
            }
            renderItem={({ item, index }) => <SearchOfferItemWrapper item={item} index={index} />}
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

          <FloatingButtonsWrapper
            layout={LinearTransition.springify().damping(15).stiffness(20).duration(1000)}>
            {shouldRenderScrollToTopButton ? (
              <ScrollToTopButton
                transition={scrollButtonTransition}
                onPress={() => {
                  listRef.current?.scrollToOffset({ offset: 0 })
                }}
              />
            ) : null}

            <SearchMapButton
              setHasBeenClicked={setHasBeenClicked}
              shouldDisplayMapButtonText={shouldDisplayMapButtonText}
            />
          </FloatingButtonsWrapper>
        </Container>
      )}
    </React.Fragment>
  )
}

const Container = styled.View({
  flex: 1,
})

const LineSeparator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginVertical: theme.designSystem.size.spacing.l,
}))

const FloatingButtonsWrapper = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.designSystem.size.spacing.s,
  right: theme.designSystem.size.spacing.xl,
  bottom: theme.tabBar.height + theme.designSystem.size.spacing.xl,
  zIndex: theme.zIndex.floatingButton,
}))
