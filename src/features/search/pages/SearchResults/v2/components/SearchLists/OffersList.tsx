import { FlashList, FlashListRef } from '@shopify/flash-list'
import React, { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 } from 'uuid'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { usePreviousRouteName } from 'features/navigation/helpers/usePreviousRouteName'
import { useSearch } from 'features/search/context/SearchWrapper'
import { getGridTileRatio } from 'features/search/helpers/getGridTileRatio'
import { ListHeaderComponent } from 'features/search/pages/SearchResults/v2/components/SearchLists/components/ListHeaderComponent'
import { ANIMATION_DURATION } from 'features/search/pages/SearchResults/v2/components/SearchLists/searchLists.constants'
import { SearchOfferItemWrapper } from 'features/search/pages/SearchResults/v2/components/SearchListsItems/SearchOfferItemWrapper'
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
import { Offer } from 'shared/offer/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ScrollToTopButton } from 'ui/components/ScrollToTopButton'
import { Spacer } from 'ui/theme'

const searchIdGenerated = v4()
const isWeb = Platform.OS === 'web'

export const OffersList: FC<PropsWithChildren<{ searchFilters: FetchSearchResultsArgs }>> = ({
  children,
  searchFilters,
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

  const handleEndReached = async () => {
    if (!(offersResponse && hasNextPage)) {
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

  const { headerTransition: scrollButtonTransition, onScroll } = useOpacityTransition()

  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  if (showSkeleton) return <OffersListSkeleton />

  return (
    <React.Fragment>
      <Container>
        <FlashList
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
          onScroll={onScroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Container>
      {shouldRenderScrollToTopButton ? (
        <ScrollToTopContainer>
          <ScrollToTopButton
            transition={scrollButtonTransition}
            onPress={() => {
              listRef.current?.scrollToOffset({ offset: 0 })
            }}
          />
          <Spacer.BottomScreen />
        </ScrollToTopContainer>
      ) : null}
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

const ScrollToTopContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  position: 'absolute',
  right: theme.designSystem.size.spacing.xl,
  bottom: theme.tabBar.height + theme.designSystem.size.spacing.xl,
  zIndex: theme.zIndex.floatingButton,
}))
